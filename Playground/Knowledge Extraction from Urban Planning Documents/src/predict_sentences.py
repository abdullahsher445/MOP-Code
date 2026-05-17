import joblib
import pandas as pd


def load_model(model_path: str):
    """
    Load trained classifier.
    """
    return joblib.load(model_path)


def predict_sentences(model, sentences: list[str]) -> pd.DataFrame:
    """
    Predict labels for a list of sentences.
    """
    if not sentences:
        return pd.DataFrame(columns=["sentence", "predicted_label", "confidence"])

    predicted_labels = model.predict(sentences)
    probabilities = model.predict_proba(sentences)
    max_probs = probabilities.max(axis=1)

    df = pd.DataFrame({
        "sentence": sentences,
        "predicted_label": predicted_labels,
        "confidence": max_probs
    })

    return df