import re
import openai
from app.db import engine
from app.utils.schema_utils import get_db_schema

class SQLGeneratorAgent:
    def __init__(self, llm_model: str = "gpt-4o-mini"):
        self.engine = engine
        self.llm_model = llm_model
        self.schema = get_db_schema()  # dynamically introspect schema

    def generate(self, query: str) -> str:
        """
        Convert natural language query into SQL using OpenAI + schema.
        Ensures schema-awareness to prevent invalid queries.
        """
        schema_str = "\n".join(
            [f"{table}: {', '.join(cols)}" for table, cols in self.schema.items()]
        )

        prompt = f"""
You are a helpful AI that converts natural language into SQL queries.

The database schema is as follows:
{schema_str}

User request:
{query}

Rules:
- Return ONLY a valid SQL query.
- Do NOT include explanations or comments.
- Do NOT wrap the query in markdown fences (no ```sql).
"""

        response = openai.chat.completions.create(
            model=self.llm_model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        sql = response.choices[0].message.content.strip()
        return self._clean_sql(sql)

    def _clean_sql(self, sql: str) -> str:
        """
        Normalize SQL: strip markdown, comments, and whitespace.
        """
        sql = sql.strip()
        if sql.startswith("```"):
            sql = re.sub(r"^```sql\s*", "", sql, flags=re.IGNORECASE)
            sql = re.sub(r"^```", "", sql)
            sql = re.sub(r"```$", "", sql).strip()
        return sql
