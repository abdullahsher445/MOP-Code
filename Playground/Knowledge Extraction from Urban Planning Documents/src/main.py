import os
import pandas as pd
from src.extract_text import extract_all_pdfs
from src.preprocess_text import clean_text, split_into_sentences
from src.predict_sentences import load_model, predict_sentences
from src.knowledge_extraction import build_structured_records
from src.save_output import ensure_folder, save_as_csv, save_as_json


def main():
    raw_data_folder = "data/raw"
    processed_data_folder = "data/processed"
    output_folder = "outputs"
    model_path = "models/sentence_classifier.joblib"

    ensure_folder(processed_data_folder)
    ensure_folder(output_folder)

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found: {model_path}\n"
            "Please label training data and run train_classifier.py first."
        )

    model = load_model(model_path)

    extracted_documents = extract_all_pdfs(raw_data_folder)

    all_structured_results = []
    all_sentence_predictions = []

    for filename, raw_text in extracted_documents.items():
        cleaned_text = clean_text(raw_text)

        # Save cleaned text
        txt_filename = filename.replace(".pdf", ".txt")
        txt_path = os.path.join(processed_data_folder, txt_filename)
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(cleaned_text)

        # Sentence split
        sentences = split_into_sentences(cleaned_text)

        # Predict sentence labels
        prediction_df = predict_sentences(model, sentences)
        prediction_df["document_name"] = filename
        all_sentence_predictions.append(prediction_df)

        # Build structured records
        records = build_structured_records(prediction_df, filename)
        all_structured_results.extend(records)

    # Save sentence-level predictions
    sentence_predictions_df = pd.concat(all_sentence_predictions, ignore_index=True)
    sentence_predictions_df.to_csv(
        os.path.join(output_folder, "sentence_predictions.csv"),
        index=False,
        encoding="utf-8"
    )

    # Save final outputs
    save_as_json(
        all_structured_results,
        os.path.join(output_folder, "extracted_results.json")
    )
    save_as_csv(
        all_structured_results,
        os.path.join(output_folder, "extracted_results.csv")
    )

    print("Processing complete.")
    print(f"Processed {len(extracted_documents)} PDF file(s).")
    print("Results saved in the outputs folder.")


if __name__ == "__main__":
    main()