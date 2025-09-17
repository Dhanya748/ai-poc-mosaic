from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from sqlalchemy import text
from datetime import datetime
import base64

from app.db import engine

# -------------------- Router --------------------
router = APIRouter(prefix="/sources", tags=["Sources"])

# -------------------- Models --------------------

class SourceCredentials(BaseModel):
    """Nested 'credentials' object for creating/updating a source."""
    host: str = Field(..., alias="account")
    port: int = 5432
    dbname: str = Field(..., alias="database")
    user: str = Field(..., alias="username")
    password: str
    warehouse: Optional[str] = None
    role: Optional[str] = None


class SourceCreate(BaseModel):
    """Request body for creating a source."""
    name: str
    slug: Optional[str] = None
    type: str
    credentials: SourceCredentials


class SourceUpdate(BaseModel):
    """Request body for updating a source."""
    name: Optional[str] = None
    type: Optional[str] = None
    credentials: Optional[SourceCredentials] = None


class SourceInfo(BaseModel):
    """Response schema for listing/fetching sources."""
    id: int
    name: str
    type: str
    created_at: datetime

# -------------------- Utility --------------------

def encrypt_password(password: str) -> str:
    """Simple base64 encoding (not secure for production)."""
    return base64.b64encode(password.encode("utf-8")).decode("utf-8")

# -------------------- Endpoints --------------------

@router.get("/", response_model=List[SourceInfo])
def get_sources():
    """Fetch all data sources."""
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT id, name, type, created_at FROM data_sources ORDER BY created_at DESC")
            )
            sources = result.mappings().all()
        return sources
    except Exception as e:
        print(f" Error fetching sources: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sources.")


@router.get("/{source_id}", response_model=SourceInfo)
def get_source(source_id: int):
    """Fetch a single source by ID."""
    try:
        with engine.connect() as conn:
            result = conn.execute(
                text("SELECT id, name, type, created_at FROM data_sources WHERE id = :id"),
                {"id": source_id}
            ).mappings().first()
            if not result:
                raise HTTPException(status_code=404, detail="Source not found.")
        return result
    except Exception as e:
        print(f" Error fetching source {source_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch source.")


@router.post("/")
def create_source(source: SourceCreate):
    """Create a new source and its credentials."""
    try:
        with engine.connect() as conn:
            with conn.begin():
                result = conn.execute(
                    text("INSERT INTO data_sources (name, type) VALUES (:name, :type) RETURNING id"),
                    {"name": source.name, "type": source.type}
                )
                source_id = result.scalar_one()

                password_encrypted = encrypt_password(source.credentials.password)

                conn.execute(
                    text("""
                        INSERT INTO source_credentials (
                            source_id, host, port, dbname, "user", password_encrypted
                        ) VALUES (
                            :source_id, :host, :port, :dbname, :user, :password_encrypted
                        )
                    """),
                    {
                        "source_id": source_id,
                        "host": source.credentials.host,
                        "port": source.credentials.port,
                        "dbname": source.credentials.dbname,
                        "user": source.credentials.user,
                        "password_encrypted": password_encrypted,
                    },
                )

        print(f" Source '{source.name}' created with ID {source_id}")
        return {"status": "success", "message": f"Source '{source.name}' created.", "id": source_id}

    except Exception as e:
        print(f" Error creating source: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create source: {e}")


@router.put("/{source_id}")
def update_source(source_id: int, update: SourceUpdate):
    """Update an existing source."""
    try:
        with engine.connect() as conn:
            with conn.begin():
                # Update data_sources
                if update.name or update.type:
                    conn.execute(
                        text("""
                            UPDATE data_sources
                            SET name = COALESCE(:name, name),
                                type = COALESCE(:type, type)
                            WHERE id = :id
                        """),
                        {"id": source_id, "name": update.name, "type": update.type}
                    )

                # Update credentials if provided
                if update.credentials:
                    password_encrypted = encrypt_password(update.credentials.password)
                    conn.execute(
                        text("""
                            UPDATE source_credentials
                            SET host = :host,
                                port = :port,
                                dbname = :dbname,
                                "user" = :user,
                                password_encrypted = :password_encrypted
                            WHERE source_id = :source_id
                        """),
                        {
                            "source_id": source_id,
                            "host": update.credentials.host,
                            "port": update.credentials.port,
                            "dbname": update.credentials.dbname,
                            "user": update.credentials.user,
                            "password_encrypted": password_encrypted,
                        },
                    )

        print(f" Source {source_id} updated successfully.")
        return {"status": "success", "message": f"Source {source_id} updated."}

    except Exception as e:
        print(f" Error updating source {source_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update source: {e}")


@router.delete("/{source_id}")
def delete_source(source_id: int):
    """Delete a source and its credentials."""
    try:
        with engine.connect() as conn:
            with conn.begin():
                conn.execute(text("DELETE FROM source_credentials WHERE source_id = :id"), {"id": source_id})
                rows_deleted = conn.execute(text("DELETE FROM data_sources WHERE id = :id"), {"id": source_id}).rowcount

        if rows_deleted == 0:
            raise HTTPException(status_code=404, detail="Source not found.")

        print(f" Source {source_id} deleted.")
        return {"status": "success", "message": f"Source {source_id} deleted."}

    except Exception as e:
        print(f" Error deleting source {source_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete source: {e}")
