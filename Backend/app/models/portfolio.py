

from sqlalchemy import Column, Integer, String, Float
from app.models.database import Base

class PortfolioAnalytics(Base):
    __tablename__ = "portfolioanalytics"

    id = Column(Integer, primary_key=True, index=True)
    cedant = Column(String, nullable=False, unique=True)
    total_sum_insured = Column(Float, nullable=False)
    average_risk_score = Column(Float, nullable=False)
    high_risk_count = Column(Integer, default=0)
    medium_risk_count = Column(Integer, default=0)
    low_risk_count = Column(Integer, default=0)
    total_premium = Column(Float, default=0.0)

