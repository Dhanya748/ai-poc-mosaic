from app.agents.sql_generator import SQLGeneratorAgent
from app.agents.sql_executor import SQLExecutorAgent
import numpy as np

class SupervisorAgent:
    def __init__(self):
        self.generator = SQLGeneratorAgent()
        self.executor = SQLExecutorAgent()

    def handle_query(self, query: str):
        """
        Full pipeline:
        1. NL query → SQL (via SQLGeneratorAgent + schema validation)
        2. Execute SQL (via SQLExecutorAgent)
        3. Automatic segmentation if numeric columns exist
        """
        # Step 1: Generate SQL
        sql = self.generator.generate(query)

        # Step 2: Execute SQL
        try:
            results = self.executor.execute(sql)
        except Exception as e:
            return {
                "query": query,
                "sql": sql,
                "error": str(e)
            }

        # Step 3: Auto Segmentation (if numeric column exists)
        segmentation_result = {}
        if results:
            numeric_cols = [k for k, v in results[0].items() if isinstance(v, (int, float))]
            if numeric_cols:
                col_to_segment = numeric_cols[0]  # pick first numeric col
                values = [row[col_to_segment] for row in results]

                thresholds = np.percentile(values, [33, 66])  # simple 3-way split
                segments = {"low": [], "medium": [], "high": []}

                for row in results:
                    v = row[col_to_segment]
                    if v <= thresholds[0]:
                        segments["low"].append(row)
                    elif v <= thresholds[1]:
                        segments["medium"].append(row)
                    else:
                        segments["high"].append(row)

                segmentation_result = {
                    "segmentation_column": col_to_segment,
                    "segments": segments
                }

        return {
            "query": query,
            "sql": sql,
            "results": results,
            "segmentation": segmentation_result
        }
