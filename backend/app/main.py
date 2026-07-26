from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import action_items, meetings, topics, transcripts
import os

from dotenv import load_dotenv

load_dotenv()

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:3000",
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fireflies Clone API",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://fireflies-clone-mu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(meetings.router)
app.include_router(transcripts.router)
app.include_router(action_items.router)
app.include_router(topics.router)


@app.get("/")
def root():
    return {
        "name": "Fireflies Clone API",
        "status": "running",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }