import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

class RiskAnalyzer:
    def __init__(self, model_path: str = "models/risk_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.label_mapping = {0: "Low", 1: "Medium", 2: "High"}
        self.feature_columns = []
        
        # Ensure models directory exists
        os.makedirs(os.path.dirname(model_path), exist_ok=True)

    def train(self, df: pd.DataFrame, target_col: str = "RiskCategory") -> None:
        """Train the risk analysis model"""
        features = [
            "SumInsured", "PastPremium", "ClaimRatio",
            "LossFrequency", "LossSeverity", "PremiumRate",
            "DataCompletenessScore", "LossRatio", "ESGScore", "CatastropheExposure"
        ]
        
        # Keep only columns present in df
        self.feature_columns = [f for f in features if f in df.columns]
        
        if len(self.feature_columns) == 0:
            raise ValueError("No valid feature columns found in DataFrame")

        X = df[self.feature_columns]
        y = df[target_col].map({
            "Low Risk": 0,
            "Medium Risk": 1,
            "High Risk": 2,
            "Very High Risk": 2
        })

        # Handle any NaN values in target
        mask = y.notna()
        X = X[mask]
        y = y[mask]

        if len(X) == 0:
            raise ValueError("No valid training samples after cleaning")

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)

        # Save model and feature columns
        self.save_model()
        print(f"✅ Model trained and saved to {self.model_path}")

    def save_model(self):
        """Save the trained model and feature columns"""
        if self.model is None:
            raise ValueError("No model to save. Train the model first.")
        
        model_data = {
            "model": self.model,
            "features": self.feature_columns,
            "label_mapping": self.label_mapping
        }
        
        joblib.dump(model_data, self.model_path)
        print(f"💾 Model saved to {self.model_path}")

    def load_model(self):
        """Load the trained model"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"{self.model_path} not found. Train the model first.")
        
        try:
            data = joblib.load(self.model_path)
            
            # Handle both old and new format
            if isinstance(data, dict):
                self.model = data["model"]
                self.feature_columns = data.get("features", [])
                self.label_mapping = data.get("label_mapping", self.label_mapping)
            else:
                # Old format - just the model
                self.model = data
                print("⚠️ Loaded model in old format. Consider retraining to save feature columns.")
            
            print(f"📦 Loaded risk model from {self.model_path}")
            
        except Exception as e:
            raise RuntimeError(f"Error loading model: {e}")

    def predict(self, submission: dict) -> str:
        """Predict risk level for a submission"""
        if self.model is None:
            self.load_model()
        
        # Use the same columns as training
        features = [submission.get(f, 0) for f in self.feature_columns]
        
        try:
            pred = self.model.predict([features])[0]
            return self.label_mapping[pred]
        except Exception as e:
            print(f"⚠️ Prediction error: {e}")
            return "Medium"  # Default fallback

    def predict_proba(self, submission: dict) -> dict:
        """Get prediction probabilities"""
        if self.model is None:
            self.load_model()
        
        features = [submission.get(f, 0) for f in self.feature_columns]
        
        try:
            probabilities = self.model.predict_proba([features])[0]
            return {
                self.label_mapping[i]: prob 
                for i, prob in enumerate(probabilities)
            }
        except Exception as e:
            print(f"⚠️ Probability prediction error: {e}")
            return {"Low": 0.33, "Medium": 0.34, "High": 0.33}

    def get_feature_importance(self) -> dict:
        """Get feature importance from the trained model"""
        if self.model is None:
            self.load_model()
        
        if hasattr(self.model, 'feature_importances_'):
            importance = dict(zip(self.feature_columns, self.model.feature_importances_))
            return dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))
        else:
            return {}

# Example usage and initialization function
def initialize_risk_analyzer(model_path: str = "models/risk_model.pkl") -> RiskAnalyzer:
    """Initialize risk analyzer with error handling"""
    try:
        analyzer = RiskAnalyzer(model_path)
        
        # Try to load existing model
        if os.path.exists(model_path):
            analyzer.load_model()
        else:
            print(f"⚠️ No trained model found at {model_path}")
            print("You need to train the model first using analyzer.train(df)")
        
        return analyzer
        
    except Exception as e:
        print(f"❌ Error initializing RiskAnalyzer: {e}")
        # Return a basic analyzer that can still be trained
        return RiskAnalyzer(model_path)