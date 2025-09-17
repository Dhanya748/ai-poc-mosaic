from app.agents.supervisor import supervisor

class AgentService:
    @staticmethod
    def run_agent_query(user_query: str):
        return supervisor(user_query)
