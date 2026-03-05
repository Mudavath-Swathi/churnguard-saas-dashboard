# ml/utils/preprocess.py

import pandas as pd
import json
from pathlib import Path


def preprocess_data(csv_path):
    """
    Load and preprocess churn dataset.
    Returns X (features) and y (target).
    """

    # Load dataset
    df = pd.read_csv(csv_path)

    # Drop customerID (not useful for ML)
    if "customerID" in df.columns:
        df = df.drop(columns=["customerID"])

    # Convert TotalCharges to numeric (some values are blank)
    df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")

    # Fill missing values
    df["TotalCharges"].fillna(df["TotalCharges"].median(), inplace=True)

    # Convert target column
    df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})

    # Binary Yes/No columns
    binary_cols = [
        "Partner", "Dependents", "PhoneService",
        "PaperlessBilling"
    ]

    for col in binary_cols:
        df[col] = df[col].map({"Yes": 1, "No": 0})

    # Columns with multiple categories → one-hot encode
    categorical_cols = [
        "gender",
        "MultipleLines",
        "InternetService",
        "OnlineSecurity",
        "OnlineBackup",
        "DeviceProtection",
        "TechSupport",
        "StreamingTV",
        "StreamingMovies",
        "Contract",
        "PaymentMethod",
    ]

    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    # Split features and target
    X = df.drop(columns=["Churn"])
    y = df["Churn"]

    # Save feature columns (important for prediction)
    artifacts_dir = Path("ml/artifacts")
    artifacts_dir.mkdir(parents=True, exist_ok=True)

    feature_columns_path = artifacts_dir / "feature_columns.json"
    with open(feature_columns_path, "w") as f:
        json.dump(list(X.columns), f)

    return X, y
