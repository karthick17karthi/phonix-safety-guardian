"""Contacts API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()


@router.post("/contacts", response_model=schemas.ContactResponse, status_code=status.HTTP_201_CREATED)
def add_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    """Create a new emergency contact."""
    db_contact = models.Contact(
        name=contact.name,
        phone=contact.phone,
        relation=contact.relation,
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


@router.get("/contacts", response_model=list[schemas.ContactResponse])
def get_all_contacts(db: Session = Depends(get_db)):
    """Return all saved emergency contacts."""
    return db.query(models.Contact).order_by(models.Contact.id.desc()).all()


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    """Delete an emergency contact by ID."""
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()

    if contact is None:
        raise HTTPException(status_code=404, detail="Contact not found")

    db.delete(contact)
    db.commit()

    return {"message": "Contact deleted successfully", "id": contact_id}
