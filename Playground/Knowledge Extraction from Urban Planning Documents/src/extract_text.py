import os
import pdfplumber


def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extract text from a single PDF file.
    """
    all_text = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                all_text.append(page_text)

    return "\n".join(all_text)


def extract_all_pdfs(input_folder: str) -> dict:
    """
    Extract text from all PDF files in a folder.

    Returns:
        dict: {filename: extracted_text}
    """
    extracted_documents = {}

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(input_folder, filename)
            extracted_documents[filename] = extract_text_from_pdf(pdf_path)

    return extracted_documents