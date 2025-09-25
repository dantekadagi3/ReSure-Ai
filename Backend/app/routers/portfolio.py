# app/routes/portfolio_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.portfolio import PortfolioAnalytics
from app.models.database import get_db

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/", response_model=list[dict])
def get_portfolio_summary(db: Session = Depends(get_db)):
    return db.query(PortfolioAnalytics).all()
