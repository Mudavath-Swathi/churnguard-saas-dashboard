# ml/predict.py

import json
import joblib
import pandas as pd
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "churn_model.pkl"
FEATURES_PATH = BASE_DIR / "artifacts" / "feature_columns.json"


def predict_churn(customer_data: dict):
    model = joblib.load(MODEL_PATH)

    with open(FEATURES_PATH, "r") as f:
        feature_columns = json.load(f)

    df = pd.DataFrame([customer_data])

    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    df = df[feature_columns]

    prob = model.predict_proba(df)[0][1]

    if prob >= 0.7:
        risk = "high"
    elif prob >= 0.4:
        risk = "medium"
    else:
        risk = "low"

    return {
        "probability": round(float(prob), 2),
        "risk": risk
    }


# 🔥 ENTRY POINT (NODE → PYTHON)
if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())

        result = predict_churn(input_data)

        # Send result back to Node.js
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))