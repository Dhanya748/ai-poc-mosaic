# app/utils/schema_utils.py

from sqlalchemy import inspect
from app.db import engine

# Cache variable
_cached_schema = None

def get_db_schema(refresh: bool = False):
    """
    Introspects the database schema using SQLAlchemy.
    Returns a dictionary:
    {
        "table_name": ["col1", "col2", ...],
        ...
    }

    Caches results for performance.
    Use refresh=True to re-inspect schema.
    """
    global _cached_schema

    if _cached_schema is not None and not refresh:
        return _cached_schema

    inspector = inspect(engine)
    schema = {}

    try:
        for table in inspector.get_table_names():
            cols = inspector.get_columns(table)
            schema[table] = [col["name"] for col in cols]
    except Exception as e:
        raise RuntimeError(f"Failed to inspect database schema: {str(e)}")

    _cached_schema = schema
    return schema
