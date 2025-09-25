# app/routers/analysis.py
from fastapi import APIRouter
import pandas as pd
import os
from aiengine.risk_analyzer import RiskAnalyzer
from aiengine.pricing_model import PricingModel
from aiengine.portfolio_optimizer import PortfolioOptimizer

router = APIRouter(prefix="/analysis", tags=["Analysis"])

CLEANED_PATH = "data/cleaned_submissions.csv"

@router.post("/risk")
async def analyze_risk(submission: dict):
    """
    Run risk classification on a single submission.
    """
    model = RiskAnalyzer()
    category = model.predict(submission)
    return {"risk_category": category}

@router.post("/premium")
async def suggest_premium(submission: dict):
    """
    Suggest fair premium for a single submission.
    """
    model = PricingModel()
    premium = model.suggest(submission)
    return {"suggested_premium": premium}

@router.post("/portfolio")
async def optimize_portfolio():
    """
    Run portfolio optimization on all cleaned submissions.
    """
    if not os.path.exists(CLEANED_PATH):
        return {"error": "❌ Cleaned submissions not found. Run /submissions/clean first."}

    df = pd.read_csv(CLEANED_PATH)
    submissions = df[["Cedant", "SumInsured", "NormalizedRiskScore"]] \
        .rename(columns={"Cedant": "id"}) \
        .to_dict(orient="records")

    optimizer = PortfolioOptimizer(capital=1.0)
    result = optimizer.optimize(submissions)

    return {"optimized_allocation": result}
