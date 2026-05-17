import re


def clean_text(text: str) -> str:
    """
    Clean extracted text by removing extra spaces and line breaks.
    Also attempts to trim front matter / contents where possible.
    """
    if not text:
        return ""

    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = text.strip()

    start_patterns = [
        r"CHAPTER 1\s*-\s*PLANNING SCHEMES",
        r"1\.1\s*What is a planning scheme\?",
        r"What is a planning scheme\?"
    ]

    for pattern in start_patterns:
        match = re.search(pattern, text, flags=re.IGNORECASE)
        if match:
            text = text[match.start():]
            break

    return text


def split_into_sentences(text: str) -> list[str]:
    """
    Split text into sentences.
    """
    text = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r'(?<=[.!?])\s+', text)

    cleaned = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) >= 15:
            cleaned.append(sentence)

    return cleaned