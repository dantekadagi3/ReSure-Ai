# run_optimizer.py
import os
import pandas as pd
from portfolio_optimizer import PortfolioOptimizer

if __name__ == "__main__":
    # Path to cleaned dataset
    cleaned_path = "data/cleaned_submissions.csv"

    if not os.path.exists(cleaned_path):
        raise FileNotFoundError("❌ Cleaned data not found. Run your pipeline first!")

    # Load cleaned data
    df = pd.read_csv(cleaned_path)
    print(f"📂 Loaded cleaned dataset with {df.shape[0]} rows and {df.shape[1]} columns")

    # Prepare submissions for optimizer
    submissions = df[["Cedant", "SumInsured", "NormalizedRiskScore"]].to_dict(orient="records")

    # Initialize optimizer
    optimizer = PortfolioOptimizer(capital=1.0)

    # Run optimization
    result = optimizer.optimize(submissions)

    print("\n📊 Optimized Portfolio Allocation:")
    for k, v in result.items():
        print(f" - {k}: {v}")
