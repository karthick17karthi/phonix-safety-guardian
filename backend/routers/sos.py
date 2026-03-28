"""SOS alert API routes."""

import json
import logging
import os
import re
from urllib import error, request

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)


def _normalize_phone(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("00"):
        digits = digits[2:]
    return digits


def _get_whatsapp_status(db: Session) -> schemas.WhatsAppStatusResponse:
    contacts = db.query(models.Contact).all()
    contacts_found = len(contacts)
    valid_contacts = 0

    for contact in contacts:
        if _normalize_phone(contact.phone):
            valid_contacts += 1

    invalid_contacts = contacts_found - valid_contacts
    access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")

    if not access_token or not phone_number_id:
        return schemas.WhatsAppStatusResponse(
            configured=False,
            contacts_found=contacts_found,
            valid_contacts=valid_contacts,
            invalid_contacts=invalid_contacts,
            detail="WhatsApp Cloud API is not configured on the backend",
        )

    if contacts_found == 0:
        return schemas.WhatsAppStatusResponse(
            configured=True,
            contacts_found=0,
            valid_contacts=0,
            invalid_contacts=0,
            detail="No emergency contacts found",
        )

    if valid_contacts == 0:
        return schemas.WhatsAppStatusResponse(
            configured=True,
            contacts_found=contacts_found,
            valid_contacts=0,
            invalid_contacts=invalid_contacts,
            detail="No valid emergency contact phone numbers found",
        )

    detail = "WhatsApp is ready"
    if invalid_contacts > 0:
        detail = "WhatsApp is ready, but some contacts have invalid phone numbers"

    return schemas.WhatsAppStatusResponse(
        configured=True,
        contacts_found=contacts_found,
        valid_contacts=valid_contacts,
        invalid_contacts=invalid_contacts,
        detail=detail,
    )


def _send_whatsapp_message(phone: str, message: str) -> tuple[bool, str | None]:
    access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    api_version = os.getenv("WHATSAPP_API_VERSION", "v20.0")

    if not access_token or not phone_number_id:
        return False, "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID"

    url = f"https://graph.facebook.com/{api_version}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": message},
    }

    req = request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=10):
            return True, None
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        return False, f"HTTP {exc.code}: {body}"
    except error.URLError as exc:
        return False, str(exc.reason)


def _notify_contacts_whatsapp(db_alert: models.SOSAlert, db: Session) -> schemas.SOSNotificationStatus:
    contacts = db.query(models.Contact).all()
    if not contacts:
        logger.warning("SOS %s created but no emergency contacts found", db_alert.id)
        return schemas.SOSNotificationStatus(
            contacts_found=0,
            notifications_sent=0,
            notifications_failed=0,
            detail="No emergency contacts found",
        )

    message = (
        "SOS ALERT \U0001F6A8\n"
        "I need help!\n"
        f"Location: https://maps.google.com/?q={db_alert.latitude},{db_alert.longitude}"
    )

    sent_count = 0
    failed_count = 0
    last_error: str | None = None
    for contact in contacts:
        phone = _normalize_phone(contact.phone)
        if not phone:
            logger.warning("Skipping contact %s due to invalid phone number", contact.id)
            failed_count += 1
            last_error = "One or more contacts have invalid phone numbers"
            continue

        success, err = _send_whatsapp_message(phone, message)
        if success:
            sent_count += 1
        else:
            failed_count += 1
            last_error = err
            logger.error(
                "Failed to send WhatsApp SOS to contact %s (%s): %s",
                contact.id,
                phone,
                err,
            )

    if sent_count == 0:
        logger.error("SOS %s created but WhatsApp messages were not sent", db_alert.id)

    detail = None
    if sent_count == 0:
        detail = last_error or "WhatsApp delivery failed"
    elif failed_count > 0:
        detail = last_error or "Some WhatsApp messages failed"

    return schemas.SOSNotificationStatus(
        contacts_found=len(contacts),
        notifications_sent=sent_count,
        notifications_failed=failed_count,
        detail=detail,
    )


@router.post("/sos", response_model=schemas.SOSAlertResponse, status_code=status.HTTP_201_CREATED)
def create_sos_alert(alert: schemas.SOSAlertCreate, db: Session = Depends(get_db)):
    """Store a new SOS alert in the database."""
    db_alert = models.SOSAlert(
        user_name=alert.user_name,
        latitude=alert.latitude,
        longitude=alert.longitude,
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    whatsapp_status = _notify_contacts_whatsapp(db_alert, db)

    return {
        "id": db_alert.id,
        "user_name": db_alert.user_name,
        "latitude": db_alert.latitude,
        "longitude": db_alert.longitude,
        "timestamp": db_alert.timestamp,
        "whatsapp": whatsapp_status,
    }


@router.get("/sos/whatsapp-status", response_model=schemas.WhatsAppStatusResponse)
def get_whatsapp_status(db: Session = Depends(get_db)):
    """Return whether backend WhatsApp delivery is ready to send SOS notifications."""
    return _get_whatsapp_status(db)
