import os
import pandas as pd
from pricing_model import PricingModel

# Path to cleaned data
cleaned_path = "data/cleaned_submissions.csv"
if not os.path.exists(cleaned_path):
    raise FileNotFoundError("❌ Cleaned data not found. Run your pipeline first!")

# Load cleaned data
df = pd.read_csv(cleaned_path)
print(f"📂 Loaded cleaned dataset with {df.shape[0]} rows and {df.shape[1]} columns")

# Initialize pricing model
model = PricingModel(model_path="data/pricing_model.pkl")

# Train the model on cleaned data
model.train(df)

# Predict premiums and decisions for each submission
predictions = []
for idx, row in df.iterrows():
    submission = row.to_dict()
    result = model.suggest(submission)
    result["Cedant"] = row.get("Cedant", f"Submission {idx}")
    predictions.append(result)

# Convert predictions to DataFrame
pred_df = pd.DataFrame(predictions)

# Save predictions
os.makedirs("models", exist_ok=True)
pred_csv_path = "data/pricing_predictions.csv"
pred_df.to_csv(pred_csv_path, index=False)
print(f"\n✅ Premium predictions saved to {pred_csv_path}")

# Display sample
print("\n📊 Sample Premium Predictions:")
print(pred_df.head())
