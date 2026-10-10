"""
System Health Check Router
"""

from datetime import datetime
from fastapi import APIRouter
from ..database import check_db_health
from ..schemas import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def get_health():
    db_status = check_db_health()
    return {
        "status": "healthy" if db_status.get("status") == "connected" else "degraded",
        "app_name": "Maanak Drishti - Digital Legal Metrology",
        "version": "1.0.0",
        "database": db_status,
        "timestamp": datetime.utcnow()
    }
