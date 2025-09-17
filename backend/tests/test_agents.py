import requests
from app.utils.schema_utils import get_db_schema

API_BASE = "http://127.0.0.1:8000"
RUN_ENDPOINT = f"{API_BASE}/run"

# --------------------------
# Intelligent Segmentation
# --------------------------
def segment_input(user_input: str):
    """
    Splits input into segments for processing.
    - For SQL: split by semicolon
    - For agent prompts: split by newlines or logical separators
    """
    # Split SQL statements by semicolon
    if any(user_input.lower().startswith(k) for k in ["select", "insert", "update", "delete", "create", "alter", "drop"]):
        segments = [s.strip() for s in user_input.split(";") if s.strip()]
    else:
        # Split agent prompts by double newline or single newline
        segments = [s.strip() for s in user_input.split("\n\n") if s.strip()]
    return segments

# --------------------------
# Test Agent Queries
# --------------------------
def test_agent_query(prompt="Hello, tell me a joke!\n\nAnd then summarize a recent news article."):
    segments = segment_input(prompt)
    for idx, seg in enumerate(segments, 1):
        payload = {"query": seg}
        print(f"\n[Agent] Segment {idx}: {seg}")
        try:
            response = requests.post(RUN_ENDPOINT, json=payload)
            data = response.json()
            if response.status_code == 200 and data["type"] == "agent":
                print(" Agent Response:")
                print(data["response"])
            else:
                print(" Agent Error:", data.get("detail") or data)
        except Exception as e:
            print("Exception in Agent:", str(e))

# --------------------------
# Test SQL Queries
# --------------------------
def test_sql_queries():
    schema = get_db_schema()
    if not schema:
        print("\n[SQL] No tables found in database.")
        return

    for table, columns in schema.items():
        sql = f"SELECT * FROM {table} LIMIT 5"
        segments = segment_input(sql)
        for idx, seg in enumerate(segments, 1):
            payload = {"query": seg}
            print(f"\n[SQL] Table '{table}' - Segment {idx}: {seg}")
            try:
                response = requests.post(RUN_ENDPOINT, json=payload)
                data = response.json()
                if response.status_code == 200 and data["type"] == "sql":
                    print(" Results:")
                    for row in data["results"]:
                        print(row)
                else:
                    print(" Error:", data.get("detail") or data)
            except Exception as e:
                print(" Exception:", str(e))

# --------------------------
# Run All Tests
# --------------------------
if __name__ == "__main__":
    test_agent_query()
    test_sql_queries()





