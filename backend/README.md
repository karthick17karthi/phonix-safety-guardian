# Phoenix Safety Guardian Backend

This backend is built with FastAPI, PostgreSQL, SQLAlchemy ORM, and Pydantic schemas.

## Folder structure

```text
backend/
|-- main.py
|-- database.py
|-- models.py
|-- schemas.py
|-- requirements.txt
`-- routers/
    |-- __init__.py
    |-- contacts.py
    |-- sos.py
    `-- location.py
```

## Features

- Add, list, and delete emergency contacts
- Store SOS alerts
- Store live location updates
- CORS enabled for React frontend
- Automatic table creation using SQLAlchemy

## PostgreSQL setup

1. Install PostgreSQL locally.
2. Create a database named `phoenix_db`.
3. Use a valid PostgreSQL username and password.

Example SQL:

```sql
CREATE DATABASE phoenix_db;
```

## Configure the database URL

PowerShell:

```powershell
$env:DATABASE_URL = "postgresql://postgres:your_real_password@localhost/phoenix_db"
```

If you do not set `DATABASE_URL`, the app will use this default example value:

```text
postgresql://postgres:password@localhost/phoenix_db
```

## Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Run the backend

Preferred on Windows:

```powershell
python -m uvicorn main:app --reload
```

Alternative:

```bash
uvicorn main:app --reload
```

## WhatsApp automatic SOS setup

Automatic WhatsApp sending is handled by the backend using Meta WhatsApp Cloud API.

Set these environment variables before starting the backend:

```powershell
$env:WHATSAPP_ACCESS_TOKEN = "your_meta_access_token"
$env:WHATSAPP_PHONE_NUMBER_ID = "your_phone_number_id"
$env:WHATSAPP_API_VERSION = "v20.0"
python -m uvicorn main:app --reload
```

Notes:

- This does not require opening WhatsApp Web or WhatsApp Desktop from the browser.
- In development, Meta usually allows messages only to approved test recipient numbers until your app is fully configured.
- Emergency contact numbers should be stored in international format, for example `+91 98765 43210`.

## API endpoints

### Contacts

- `POST /contacts`
- `GET /contacts`
- `DELETE /contacts/{id}`

Example request body:

```json
{
  "name": "Priya Sharma",
  "phone": "+91 98765 43210",
  "relation": "Sister"
}
```

### SOS alert

- `POST /sos`
- `GET /sos/whatsapp-status`

Example request body:

```json
{
  "user_name": "Karthick",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

Example WhatsApp status response:

```json
{
  "configured": true,
  "contacts_found": 2,
  "valid_contacts": 2,
  "invalid_contacts": 0,
  "detail": "WhatsApp is ready"
}
```

### Live location

- `POST /location`

Example request body:

```json
{
  "user_name": "Karthick",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

## API docs

After the server starts:

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Important note

If startup fails with a PostgreSQL authentication error, your database is running but the username/password in `DATABASE_URL` is incorrect.
