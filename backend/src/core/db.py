"""
Secure SQLAlchemy initialization for Nuvai.
Follows ISO/IEC 27001, NIST, and OWASP security guidelines.
"""

import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session

# === Load environment variables securely from .env ===
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_PATH = ROOT_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# === Logging Setup ===
logger = logging.getLogger("DatabaseCore")
logger.setLevel(logging.INFO)
if not logger.handlers:
    console_handler = logging.StreamHandler()
    logger.addHandler(console_handler)

# Debug – Confirm loaded env path and variable
logger.info(f"🔐 Loaded .env from: {ENV_PATH}")
logger.debug(f"DATABASE_URL: {os.getenv('DATABASE_URL')}")

# === Base ORM Class ===
Base = declarative_base()

# === Load DATABASE_URL from environment ===
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    logger.critical("❌ DATABASE_URL is not set. Please check your .env file.")
    raise EnvironmentError("DATABASE_URL environment variable missing.")

# === SQLAlchemy Engine Configuration ===
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=1800,
        connect_args={"connect_timeout": 10},
        future=True,  # Enables SQLAlchemy 2.0-style usage
    )
    logger.info("✅ SQLAlchemy engine initialized.")
except Exception as e:
    logger.exception("❌ Engine creation failed.")
    raise e

# === Session Factory ===
SessionLocal = scoped_session(
    sessionmaker(bind=engine, autocommit=False, autoflush=False, future=True)
)

# === Dependency: Used in routes (via FastAPI or Flask) ===
def get_db():
    """
    Yields a secure database session for dependency injection.
    Ensures proper closing and rollback on exceptions.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.exception("❌ Error in DB session.")
        raise e
    finally:
        db.close()

# === Create Tables (Manual call or for dev/testing) ===
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("📦 Database schema created.")
    except Exception as e:
        logger.exception("❌ Failed to create database schema.")
        raise e
