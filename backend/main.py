"""FastAPI app entry point for Phoenix Safety Guardian."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import Base, engine
from routers import contacts, location, sos

# Create all database tables automatically if they do not exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Phoenix Safety Guardian API",
    description="FastAPI backend for contacts, SOS alerts, and live location updates",
    version="1.0.0",
)

# Allow the React frontend to call this API during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers.
app.include_router(contacts.router, tags=["Contacts"])
app.include_router(sos.router, tags=["SOS Alerts"])
app.include_router(location.router, tags=["Live Location"])


@app.get("/")
def root():
    """Simple health-check route."""
    return {"message": "Phoenix Safety Guardian backend is running"}
