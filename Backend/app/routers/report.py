# app/routes/report_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.database import get_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/", response_model=list[dict])
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).all()
