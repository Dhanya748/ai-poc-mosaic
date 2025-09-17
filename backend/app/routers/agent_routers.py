from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.db import engine
from app.utils.schema_utils import get_db_schema
import openai
import os
import traceback
import sqlparse
import asyncio
import re  # <-- 1. Import the regex module
from datetime import datetime

router = APIRouter()

# --- Models ---
class SegmentCreateRequest(BaseModel):
    query: str
    name: Optional[str] = None


class SegmentPreviewResponse(BaseModel):
    name: str
    description: str
    natural_query: str = Field(alias="naturalQuery")
    generated_sql: str = Field(alias="generatedSql")
    count: int

    class Config:
        populate_by_name = True


class SegmentSaveRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    natural_query: str = Field(alias="naturalQuery")
    sql_query: str = Field(alias="query")
    count: int

    class Config:
        populate_by_name = True


class SegmentInfo(BaseModel):
    id: int
    name: str
    description: str
    natural_query: str = Field(alias="naturalQuery")
    sql_query: str = Field(alias="sqlQuery")
    count: int
    created_at: datetime = Field(alias="createdAt")

    class Config:
        populate_by_name = True


# --- Helpers ---
def validate_and_sanitize_sql(sql: str) -> str:
    if not sql:
        raise ValueError("Generated SQL is empty.")
    parsed = sqlparse.parse(sql)
    if not parsed:
        raise ValueError("Invalid SQL: Could not be parsed.")
    if len(parsed) > 1:
        raise ValueError("Multiple SQL statements are not allowed.")
    statement = parsed[0]
    if statement.get_type() != "SELECT":
        raise ValueError("Only SELECT statements are allowed.")
    return sqlparse.format(str(statement), reindent=True, keyword_case="upper")


async def generate_description(natural_query: str) -> str:
    """Generate a short descriptive label from the natural query."""
    loop = asyncio.get_event_loop()
    prompt = f"""
    Summarize the following natural language query into a short descriptive label
    (max 8 words, title-style):

    "{natural_query}"
    """
    response = await loop.run_in_executor(
        None,
        lambda: openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        ),
    )
    return response.choices[0].message.content.strip()


# --- Endpoints ---
@router.post("/segments/create-and-run", response_model=SegmentPreviewResponse)
async def create_and_run_segment(request: SegmentCreateRequest):
    try:
        schema = get_db_schema()
        natural_language_query = request.query

        # Generate SQL from NL
        sql_prompt = f"""
        You are an expert SQL analyst. Convert the natural language request to a single SQL SELECT query.
        Schema:
        {schema}

        Request: "{natural_language_query}"
        """
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": sql_prompt}],
                temperature=0.0,
            ),
        )

        # --- 2. THIS IS THE CORRECTED CODE BLOCK ---
        raw_response = response.choices[0].message.content.strip()
        
        # Use regex to find content within ```sql ... ```
        match = re.search(r"```sql\n(.*?)\n```", raw_response, re.DOTALL)
        if match:
            sql_query = match.group(1).strip().strip(";")
        else:
            # Fallback if no markdown code block is found
            sql_query = raw_response.replace("```", "").strip().strip(";")
        # --- END OF FIX ---
        
        validated_sql = validate_and_sanitize_sql(sql_query)

        # Generate description
        description = await generate_description(natural_language_query)

        # Count the rows
        count_query = f"SELECT COUNT(*) FROM ({validated_sql}) as subquery"
        with engine.connect() as conn:
            result = conn.execute(text(count_query))
            count = result.scalar_one_or_none() or 0

        return SegmentPreviewResponse(
            name=request.name or description,
            description=description,
            natural_query=natural_language_query,
            generated_sql=validated_sql,
            count=count,
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/segments", response_model=List[SegmentInfo])
def get_segments():
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text(
                    "SELECT id, name, description, natural_query, sql_query, count, created_at "
                    "FROM segments ORDER BY created_at DESC"
                )
            )
            return result.mappings().all()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to fetch segments")


@router.post("/segments", response_model=SegmentInfo)
def save_segment(segment: SegmentSaveRequest):
    try:
        natural_query = segment.natural_query
        name = segment.name
        description = segment.description

        # Auto-generate description if missing
        if not description:
            loop = asyncio.get_event_loop()
            description = loop.run_until_complete(generate_description(natural_query))

        if not name:
            name = description

        with engine.connect() as conn:
            with conn.begin():
                result = conn.execute(
                    text(
                        """
                        INSERT INTO segments (name, description, natural_query, sql_query, count)
                        VALUES (:name, :description, :natural_query, :sql_query, :count)
                        RETURNING id, name, description, natural_query, sql_query, count, created_at
                        """
                    ),
                    {
                        "name": name,
                        "description": description,
                        "natural_query": natural_query,
                        "sql_query": segment.sql_query,
                        "count": segment.count,
                    },
                )
                return result.mappings().one()

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to save segment: {e}")