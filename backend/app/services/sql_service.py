from app.agents.sql_executor import execute_sql

class SQLService:
    @staticmethod
    def run_sql_query(sql_query: str):
        return execute_sql(sql_query)
