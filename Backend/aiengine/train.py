import pandas as pd
from risk_analyzer import RiskAnalyzer
import os
import joblib

model_path = "models/risk_model.pkl"

os.makedirs(os.path.dirname(model_path), exist_ok=True)

# Assuming you have a trained model object, e.g., from RiskAnalyzer
# You may need to train or load the model before saving
# For demonstration, let's assume analyzer.model exists after training
# Load your dataset into a pandas DataFrame
df = pd.read_csv("data/cleaned_submissions.csv")  # Update the path as needed

# Initialize analyzer
analyzer = RiskAnalyzer(model_path=model_path)

# Train on cleaned data
analyzer.train(df, target_col="RiskCategory")

# Save the trained model
joblib.dump(analyzer.model, model_path)
print(f"💾 Model saved to {model_path}")
analyzer = RiskAnalyzer(model_path="aiengine/models/risk_model.pkl")

# Train on cleaned data
analyzer.train(df, target_col="RiskCategory")
