# ml/explain.py

import json
import joblib
import pandas as pd
import sys
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "churn_model.pkl"
FEATURES_PATH = BASE_DIR / "artifacts" / "feature_columns.json"

# Load model & features
model = joblib.load(MODEL_PATH)

with open(FEATURES_PATH, "r") as f:
    feature_columns = json.load(f)


def explain_churn(customer_data: dict):
    """
    Returns churn probability, risk level,
    reasons for churn, and recommendations
    """

    # Convert input to DataFrame
    df = pd.DataFrame([customer_data])

    # Ensure all feature columns exist
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0

    # Keep correct order
    df = df[feature_columns]

    # Predict probability
    prob = model.predict_proba(df)[0][1]

    # Risk bucket
    if prob >= 0.7:
        risk = "high"
    elif prob >= 0.4:
        risk = "medium"
    else:
        risk = "low"

    # ------------------
    # Explanation logic
    # ------------------
    reasons = []
    recommendations = []

    if customer_data.get("Contract_Month-to-month", 0) == 1:
        reasons.append("Customer is on a month-to-month contract")
        recommendations.append("Offer long-term contract discounts")

    if customer_data.get("PaperlessBilling_Yes", 0) == 1:
        reasons.append("Uses paperless billing")
        recommendations.append("Provide loyalty incentives for paperless users")

    if customer_data.get("MonthlyCharges", 0) > 80:
        reasons.append("High monthly charges")
        recommendations.append("Offer personalized pricing plans")

    if customer_data.get("tenure", 0) < 12:
        reasons.append("Low customer tenure")
        recommendations.append("Engage customer with onboarding offers")

    if risk == "low":
        recommendations.append("Maintain service quality and engagement")

    return {
        "probability": round(float(prob), 2),
        "risk": risk,
        "reasons": reasons,
        "recommendations": recommendations
    }


# ------------------------
# Run from command line
# ------------------------
if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        result = explain_churn(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))