"""
FastAPI Main Application Entry Point for Maanak Drishti
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import engine, Base, db_engine_type
from .routers import health, reports, ocr, compliance

load_dotenv()

from .models import Report, InspectorAudit

# Initialize tables immediately on module load
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist on server startup
    Base.metadata.create_all(bind=engine)
    print(f"[OK] Maanak Drishti Backend started with database: {db_engine_type}")
    yield

app = FastAPI(
    title="Maanak Drishti - Digital Legal Metrology API",
    description="Backend API services for statutory packaging compliance, OCR verification, and citizen grievance reporting.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [o.strip() for o in origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api/v1 prefix
app.include_router(health.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(ocr.router, prefix="/api/v1")
app.include_router(compliance.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "app": "Maanak Drishti - Digital Legal Metrology",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
        "database": db_engine_type
    }
