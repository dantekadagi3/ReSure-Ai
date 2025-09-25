import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

class PricingModel:
    """
    Premium prediction model.
    Uses RandomForest Regressor to suggest fair premiums
    and applies simple acceptance rules based on claim ratio.
    """

    def __init__(self, model_path: str = "models/pricing_model.pkl"):
        self.model_path = model_path
        self.model = None

    def train(self, df: pd.DataFrame, target_col: str = "PastPremium") -> None:
        """Train a regression model on cleaned features."""
        features = [
            "SumInsured", "ClaimRatio", "LossFrequency", "LossSeverity",
            "PremiumRate", "NormalizedRiskScore"
        ]
        features = [f for f in features if f in df.columns]

        if not features:
            raise ValueError("No valid features found in the dataframe!")

        X = df[features]
        y = df[target_col]

        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # RandomForest regressor
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

        # Evaluate
        preds = self.model.predict(X_test)
        print("📊 Pricing Model Evaluation:")
        print(f"MAE: {mean_absolute_error(y_test, preds):.2f}")
        print(f"R²: {r2_score(y_test, preds):.2f}")

        # Save model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.model, self.model_path)
        print(f"✅ Model saved to {self.model_path}")

    def load_model(self):
        """Load a previously trained model"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print(f"📦 Loaded pricing model from {self.model_path}")
        else:
            raise FileNotFoundError(f"{self.model_path} not found. Train the model first.")

    def suggest(self, submission: dict) -> dict:
        """
        Suggest a fair premium and accept/reject based on claim ratio.
        - ClaimRatio > 0.8 → Reject
        - ClaimRatio <= 0.8 → Accept
        """
        if not self.model:
            self.load_model()

        feature_order = [
            "SumInsured", "ClaimRatio", "LossFrequency",
            "LossSeverity", "PremiumRate", "NormalizedRiskScore"
        ]
        features = [submission.get(f, 0) for f in feature_order]

        predicted_premium = float(self.model.predict([features])[0])

        # Apply acceptance rule
        if submission.get("ClaimRatio", 0) > 0.8:
            decision = "REJECT"
        else:
            decision = "ACCEPT"

        print(f"💡 Suggested Premium: {predicted_premium:,.2f} USD | Decision: {decision}")
        return {"Premium": predicted_premium, "Decision": decision}


if __name__ == "__main__":
    # Load cleaned data
    cleaned_path = "data/cleaned_submissions.csv"  # adjust path if needed
    if not os.path.exists(cleaned_path):
        raise FileNotFoundError("❌ Cleaned data not found. Run your pipeline first!")

    df = pd.read_csv(cleaned_path)
    model = PricingModel()
    model.train(df)

    # Example new submission
    new_case = {
        "SumInsured": 500000,
        "ClaimRatio": 0.35,
        "LossFrequency": 0.08,
        "LossSeverity": 0.25,
        "PremiumRate": 0.04,
        "NormalizedRiskScore": 0.7
    }
    model.suggest(new_case)
