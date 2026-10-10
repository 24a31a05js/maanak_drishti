"""
Database Configuration & Session Manager for Maanak Drishti
Supports MySQL 8.0+ production databases with automatic graceful fallback
to persistent local SQLite storage when MySQL server daemon is not running.
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

logger = logging.getLogger("maanak_drishti.db")
logging.basicConfig(level=logging.INFO)

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "root")
DB_NAME = os.getenv("DB_NAME", "maanak_drishti")
DATABASE_URL_OVERRIDE = os.getenv("DATABASE_URL")

Base = declarative_base()

# Construct candidate MySQL 8 connection URI
mysql_url = (
    DATABASE_URL_OVERRIDE
    if DATABASE_URL_OVERRIDE
    else f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

engine = None
db_engine_type = "unknown"

def init_engine():
    global engine, db_engine_type
    
    # 1. Attempt connection to MySQL 8
    try:
        # First test root or server connectivity without auto-crash
        test_mysql_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/"
        temp_engine = create_engine(test_mysql_url, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4;"))
            conn.commit()
            
        engine = create_engine(
            mysql_url,
            pool_recycle=3600,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 5}
        )
        with engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
        db_engine_type = "MySQL 8"
        logger.info(f"[OK] Successfully connected to MySQL 8 database '{DB_NAME}' on {DB_HOST}:{DB_PORT}")
        return engine
    except Exception as e:
        logger.warning(
            f"[!] MySQL 8 server not detected on {DB_HOST}:{DB_PORT} ({e}).\n"
            f"  Defaulting to persistent local SQL database (maanak_drishti.db).\n"
            f"  To connect to MySQL 8, start MySQL server and ensure DB_USER/DB_PASSWORD match in backend/.env"
        )
    
    # 2. Local SQLite fallback for reliable zero-crash execution
    db_file = Path(__file__).resolve().parent.parent / "maanak_drishti.db"
    sqlite_url = f"sqlite:///{db_file}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    db_engine_type = "SQLite (Local Persistent)"
    logger.info(f"[OK] Active database engine: {db_engine_type} at {db_file}")
    return engine

engine = init_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database session management"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_db_health():
    """Check database status and return dialect and latency info"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1;"))
        return {
            "status": "connected",
            "engine": db_engine_type,
            "database": DB_NAME if "MySQL" in db_engine_type else "maanak_drishti.db"
        }
    except Exception as e:
        return {
            "status": "error",
            "engine": db_engine_type,
            "error": str(e)
        }
