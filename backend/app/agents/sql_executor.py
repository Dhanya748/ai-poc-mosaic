
import re
from sqlalchemy import text
from app.db import engine
from decimal import Decimal

class SQLExecutorAgent:
    def __init__(self):
        self.engine = engine

    def execute(self, sql: str):
        """
        Run a raw SQL query against the database.
        Cleans query and converts Decimal to float for JSON serialization.
        """
        sql = self._clean_sql(sql)

        with self.engine.connect() as connection:
            result = connection.execute(text(sql))
            data = []
            for row in result:
                # Convert RowMapping -> dict + Decimal -> float
                row_dict = {
                    k: float(v) if isinstance(v, Decimal) else v
                    for k, v in row._mapping.items()
                }
                data.append(row_dict)

        return data

    def _clean_sql(self, sql: str) -> str:
        """
        Remove markdown formatting or extra whitespace from SQL.
        """
        sql = sql.strip()
        if sql.startswith("```"):
            sql = re.sub(r"^```sql\s*", "", sql, flags=re.IGNORECASE)
            sql = re.sub(r"^```", "", sql)
            sql = re.sub(r"```$", "", sql).strip()
        return sql
