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
