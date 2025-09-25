# aiengine/ai_service.py
import os
import pandas as pd
from aiengine.pricing_model import PricingModel
from aiengine.risk_analyzer import RiskAnalyzer
from app.models.portfolio import PortfolioAnalytics  # Your portfolio module

class AIService:
    """
    Unified AI service to handle submissions:
    - Risk classification
    - Premium suggestion
    - Portfolio analytics
    """

    def __init__(self, cleaned_data_path="aiengine/data/cleaned_submissions.csv"):
        self.cleaned_data_path = cleaned_data_path

        # Initialize models
        self.risk_model = RiskAnalyzer(model_path="aiengine/models/risk_model.pkl")
        self.pricing_model = PricingModel(model_path="aiengine/models/pricing_model.pkl")
        self.portfolio_model = PortfolioAnalytics()  # assume it has analyze(df) method

        # Load cleaned data if exists
        self.cleaned_df = None
        if os.path.exists(self.cleaned_data_path):
            self.cleaned_df = pd.read_csv(self.cleaned_data_path)
            print(f"📂 Loaded cleaned dataset with {len(self.cleaned_df)} rows and {len(self.cleaned_df.columns)} columns")

    # ---------------- Risk Analysis ----------------
    def predict_risk(self, submission: dict):
        """Predict risk category for a single submission"""
        if not self.risk_model.model:
            self.risk_model.load_model()
        return self.risk_model.predict(pd.DataFrame([submission]))[0]

    # ---------------- Premium Suggestion ----------------
    def suggest_premium(self, submission: dict):
        """Suggest premium for a single submission"""
        if not self.pricing_model.model:
            self.pricing_model.load_model()
        return self.pricing_model.suggest(submission)

    # ---------------- Portfolio Analytics ----------------
    def portfolio_report(self):
        """Return portfolio-level insights"""
        if self.cleaned_df is None:
            raise FileNotFoundError("Cleaned data not loaded!")
        return self.portfolio_model.analyze(self.cleaned_df)

    # ---------------- Batch Processing ----------------
    def process_submissions(self, df: pd.DataFrame):
        """Add risk category and suggested premium columns to a dataframe"""
        df = df.copy()
        df["RiskCategory"] = df.apply(lambda row: self.predict_risk(row.to_dict()), axis=1)
        df["SuggestedPremium"] = df.apply(lambda row: self.suggest_premium(row.to_dict()), axis=1)
        return df
