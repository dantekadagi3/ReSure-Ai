# app/routers/submissions.py
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import AIService

router = APIRouter(prefix="/submissions", tags=["Submissions"])
ai_service = AIService()

class SubmissionInput(BaseModel):
    SumInsured: float
    ClaimRatio: float
    LossFrequency: float
    LossSeverity: float
    PremiumRate: float
    NormalizedRiskScore: float
    # Add any other fields your models require

@router.post("/analyze")
def analyze_submission(submission: SubmissionInput):
    sub_dict = submission.dict()
    risk = ai_service.predict_risk(sub_dict)
    premium = ai_service.suggest_premium(sub_dict)
    return {"RiskCategory": risk, "SuggestedPremium": premium}

@router.get("/portfolio")
def portfolio_report():
    return ai_service.portfolio_report()
