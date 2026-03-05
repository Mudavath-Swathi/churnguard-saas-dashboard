# ml/train.py

import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from utils.preprocess import preprocess_data


def train_model():
    # Paths
    data_path = Path("ml/data/churn.csv")
    model_dir = Path("ml/models")
    model_dir.mkdir(parents=True, exist_ok=True)
    model_path = model_dir / "churn_model.pkl"

    # Load & preprocess data
    X, y = preprocess_data(data_path)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Model (strong baseline for churn)
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )

    # Train
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    print("✅ Model trained successfully")
    print(f"Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save model
    joblib.dump(model, model_path)
    print(f"📦 Model saved at: {model_path}")


if __name__ == "__main__":
    train_model()