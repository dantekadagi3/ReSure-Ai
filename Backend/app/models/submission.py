
# app/models/submission.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.models.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    cedant = Column(String, nullable=False)
    insured = Column(String, nullable=False)
    geography = Column(String, nullable=True)
    peril = Column(String, nullable=True)
    business_type = Column(String, nullable=True)
    sum_insured = Column(Float, nullable=False)
    past_premium = Column(Float, default=0.0)
    risk_category = Column(String, nullable=True)  # Low, Medium, High
    normalized_risk_score = Column(Float, nullable=True)
    suggested_premium = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# models/submission.py
#This is a Pydantic model for a submission in a document processing system.
# It includes fields for the submission ID, sender, subject, received date, attachments, and status.
# The model uses Pydantic for data validation and serialization.
# This model is used to represent a submission in the system, including its metadata and status.
# This model is used in the FastAPI application to handle submissions and their metadata.
# This model is used in the FastAPI application to handle submissions and their metadata.
from pydantic import BaseModel
from datetime import datetime

class Submission(BaseModel):
    id: str
    sender: str
    subject: str
    received_at: datetime
    attachments: list[str]  # file paths in storage
    status: str = "INGESTED"

