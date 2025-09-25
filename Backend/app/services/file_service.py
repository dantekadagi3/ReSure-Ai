# aiengine/files.py
import pandas as pd
import os
import json

def save_csv(df, path="aiengine/data/processed_predictions.csv"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    df.to_csv(path, index=False)
    print(f"✅ Saved CSV to {path}")

def save_json(data, path="aiengine/data/processed_predictions.json"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved JSON to {path}")

def load_csv(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path} not found")
    return pd.read_csv(path)

def load_json(path):
    import json
    if not os.path.exists(path):
        raise FileNotFoundError(f"{path} not found")
    with open(path) as f:
        return json.load(f)
