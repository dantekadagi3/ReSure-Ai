# app/models/report.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.models.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    total_submissions = Column(Integer, default=0)
    total_sum_insured = Column(Float, default=0.0)
    average_risk_score = Column(Float, default=0.0)
    high_risk_count = Column(Integer, default=0)
    medium_risk_count = Column(Integer, default=0)
    low_risk_count = Column(Integer, default=0)
    total_premium = Column(Float, default=0.0)
