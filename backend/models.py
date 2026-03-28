"""SQLAlchemy ORM models for Phoenix Safety Guardian."""

from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func

from database import Base


class Contact(Base):
    """Stores emergency contacts."""

    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    relation = Column(String, nullable=False)


class SOSAlert(Base):
    """Stores emergency SOS alerts triggered by users."""

    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class Location(Base):
    """Stores live location updates from users."""

    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
