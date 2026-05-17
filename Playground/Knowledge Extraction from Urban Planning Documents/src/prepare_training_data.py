import os
import random
import pandas as pd
from src.preprocess_text import split_into_sentences


def build_sentence_candidates(processed_folder: str, output_csv: str, max_per_doc: int = 60) -> None:
    """
    Create a CSV of candidate sentences for manual labelling.

    Output columns:
    - document_name
    - sentence
    - label  (empty for manual annotation)
    """
    rows = []

    for filename in os.listdir(processed_folder):
        if not filename.lower().endswith(".txt"):
            continue

        file_path = os.path.join(processed_folder, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        sentences = split_into_sentences(text)

        if len(sentences) > max_per_doc:
            sentences = random.sample(sentences, max_per_doc)

        for sentence in sentences:
            rows.append({
                "document_name": filename,
                "sentence": sentence,
                "label": ""
            })

    df = pd.DataFrame(rows)
    df.to_csv(output_csv, index=False, encoding="utf-8")
    print(f"Sentence candidates saved to: {output_csv}")


if __name__ == "__main__":
    build_sentence_candidates(
        processed_folder="data/processed",
        output_csv="data/training/sentence_candidates.csv"
    )