"""Database configuration for Phoenix Safety Guardian.

This module sets up:
1. The PostgreSQL database engine
2. The SQLAlchemy session factory
3. The Base class for all ORM models
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# PostgreSQL connection string.
# Replace the password with your actual PostgreSQL password,
# or set the DATABASE_URL environment variable before starting the server.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:karthick17@localhost/phoenix_db",
)

# SQLAlchemy engine handles the actual connection to PostgreSQL.
engine = create_engine(DATABASE_URL)

# Each request will use its own database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all SQLAlchemy models.
Base = declarative_base()


def get_db():
    """Provide a database session to FastAPI routes.

    The session is created when a request starts and closed when it ends.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
