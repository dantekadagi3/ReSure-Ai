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
