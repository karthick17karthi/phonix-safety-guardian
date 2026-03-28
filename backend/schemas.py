"""Pydantic schemas for request and response validation."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ContactBase(BaseModel):
    """Shared contact fields."""

    name: str
    phone: str
    relation: str


class ContactCreate(ContactBase):
    """Schema used when creating a contact."""

    pass


class ContactResponse(ContactBase):
    """Schema returned to the client after reading a contact."""

    id: int

    model_config = ConfigDict(from_attributes=True)


class SOSAlertCreate(BaseModel):
    """Schema used when storing an SOS alert."""

    user_name: str
    latitude: float
    longitude: float


class SOSNotificationStatus(BaseModel):
    """WhatsApp delivery summary for an SOS alert."""

    contacts_found: int
    notifications_sent: int
    notifications_failed: int
    detail: str | None = None


class WhatsAppStatusResponse(BaseModel):
    """Backend WhatsApp readiness summary."""

    configured: bool
    contacts_found: int
    valid_contacts: int
    invalid_contacts: int
    detail: str


class SOSAlertResponse(SOSAlertCreate):
    """Schema returned after storing an SOS alert."""

    id: int
    timestamp: datetime
    whatsapp: SOSNotificationStatus

    model_config = ConfigDict(from_attributes=True)


class LocationCreate(BaseModel):
    """Schema used when storing a location update."""

    user_name: str
    latitude: float
    longitude: float


class LocationResponse(LocationCreate):
    """Schema returned after storing a location update."""

    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
