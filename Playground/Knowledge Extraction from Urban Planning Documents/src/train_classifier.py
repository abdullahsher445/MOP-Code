import os
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score


VALID_LABELS = {"definition", "permit_related", "authority", "component", "other"}


def train_model(training_csv: str, model_path: str) -> None:
    """
    Train a sentence classification model using TF-IDF + Logistic Regression.
    """
    df = pd.read_csv(training_csv)

    if "sentence" not in df.columns or "label" not in df.columns:
        raise ValueError("Training CSV must contain 'sentence' and 'label' columns.")

    df = df.dropna(subset=["sentence", "label"])
    df["label"] = df["label"].astype(str).str.strip()
    df["sentence"] = df["sentence"].astype(str).str.strip()

    df = df[df["label"].isin(VALID_LABELS)]
    df = df[df["sentence"] != ""]

    if len(df) < 20:
        raise ValueError("Not enough labelled samples. Please label more sentences before training.")

    X = df["sentence"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            max_features=5000
        )),
        ("clf", LogisticRegression(
            max_iter=1000,
            class_weight="balanced"
        ))
    ])

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    print("Accuracy:", round(accuracy_score(y_test, y_pred), 4))
    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")


if __name__ == "__main__":
    train_model(
        training_csv="data/training/sentence_labels.csv",
        model_path="models/sentence_classifier.joblib"
    )