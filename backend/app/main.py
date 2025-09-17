import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import openai

# Import BOTH routers
from app.routers import agent_routers
from app.routers import sources_router  # <--- IMPORT THE NEW ROUTER

# Load environment
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="LangGraph Agent API")

#  CORS Middleware (allow both 8080 and 5173)
origins = [
    "http://localhost:8080",  # frontend 
    "http://localhost:5173",  # Vite default dev server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include both routers
app.include_router(agent_routers.router)
app.include_router(sources_router.router)

@app.get("/")
def root():
    return {"status": "API is running"}
