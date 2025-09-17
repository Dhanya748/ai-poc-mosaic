# AI-POC-Mosaic

**AI-Powered Proof-of-Concept for Mosaic Intelligence**  

This repository contains a full-stack project with a React frontend and a FastAPI backend. The backend uses **LangGraph** and **LangChain** for routing natural language queries to SQL.

---

## Tech Stack
**Frontend:**  
- Vite + React 18 + TypeScript  
- TailwindCSS  
- Axios  

**Backend:**  
- Python 3.9+  
- FastAPI  
- Uvicorn  
- PostgreSQL / MySQL (configurable)  
- LangGraph + LangChain  
- Pandas  

---

## Project Structure
ai-poc-mosaic/
│
├─ frontend/
│ ├─ src/
│ ├─ public/
│ └─ package.json
│
├─ backend/
│ ├─ app/
│ ├─ requirements.txt
│ └─ .env
│
└─ README.md

### Frontend
cd frontend
npm install
npm run dev
Open browser at http://localhost:5173

###Backend
cd backend
python -m venv .venv
source .venv/bin/activate    # Linux/Mac
# OR
.\.venv\Scripts\Activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
API docs available at:

Swagger: http://127.0.0.1:8000/docs

ReDoc: http://127.0.0.1:8000/redoc

API Example
POST /sql/execute
Request:

json
Copy code
{
  "query": "Show me the top 5 customers by purchase amount",
  "segmentation_instruction": "Create 2 segments: high-value and low-value customers"
}

Notes
Backend routers are powered by LangGraph and LangChain.

Use the frontend UI to input queries in natural language.
