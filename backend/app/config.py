import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

    def check(self):
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is not set in .env")
        if not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set in .env")

settings = Settings()
settings.check()
