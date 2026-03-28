"""Live location API routes."""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/location", response_model=schemas.LocationResponse, status_code=status.HTTP_201_CREATED)
def update_location(location: schemas.LocationCreate, db: Session = Depends(get_db)):
    """Store a user's live location update."""
    db_location = models.Location(
        user_name=location.user_name,
        latitude=location.latitude,
        longitude=location.longitude,
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location
