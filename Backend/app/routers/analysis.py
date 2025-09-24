from fastapi import APIRouter

router = APIRouter()

@router.get("/risk")
def risk_analysis():
    return {"risk_score": 0.25}
