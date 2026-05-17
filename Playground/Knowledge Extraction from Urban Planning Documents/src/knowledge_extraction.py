import re
import pandas as pd

TARGET_TERMS = [
    "planning scheme",
    "zone",
    "overlay",
    "planning permit",
    "responsible authority",
    "planning authority",
    "schedule"
]


def infer_purpose(definition_text: str, term: str) -> str:
    """
    Infer purpose/function from definition text and term.
    """
    text = str(definition_text).lower()

    if term == "planning scheme":
        if "land use" in text or "development" in text or "control" in text:
            return "Controls land use and development."
    elif term == "zone":
        if "use" in text or "land" in text or "identify" in text:
            return "Designates land for particular uses."
    elif term == "overlay":
        if "additional" in text or "specific" in text or "control" in text:
            return "Applies additional controls for specific issues."
    elif term == "planning permit":
        if "permit" in text or "approval" in text or "grant" in text:
            return "Provides approval for a use or development."
    elif term == "responsible authority":
        if "application" in text or "decision" in text or "administer" in text:
            return "Assesses or decides planning applications."
    elif term == "planning authority":
        if "prepare" in text or "amend" in text or "scheme" in text:
            return "Prepares or amends the planning scheme."
    elif term == "schedule":
        if "local" in text or "requirements" in text or "objectives" in text:
            return "Adds detailed or local provisions to controls."

    return "Not specified"


def extract_authority_names(text: str) -> str:
    """
    Extract authority mentions from sentence text.
    """
    text_lower = str(text).lower()
    found = []

    for item in ["responsible authority", "planning authority", "council", "minister", "vcat"]:
        if item in text_lower:
            found.append(item)

    if found:
        return ", ".join(sorted(set(found)))

    return "Not specified"


def extract_related_components(text: str) -> str:
    """
    Extract related components from sentence text.
    """
    text_lower = str(text).lower()
    found = []

    for item in ["zone", "overlay", "schedule", "planning scheme", "planning permit", "vpp"]:
        if item in text_lower:
            found.append(item)

    if found:
        return ", ".join(sorted(set(found)))

    return "Not specified"


def extract_source_section(text: str) -> str:
    """
    Extract section number if present.
    """
    match = re.search(r"\b(\d+\.\d+(?:\.\d+)?)\b", str(text))
    if match:
        return match.group(1)

    return "Not specified"


def sentence_quality_score(sentence: str, term: str, label: str, confidence: float) -> float:
    """
    Score sentence quality so better candidates are preferred.
    """
    s = str(sentence).strip()
    s_lower = s.lower()
    score = float(confidence)

    # Must contain the target term
    if term not in s_lower:
        return -999.0

    # Prefer better definition-style sentences
    if label == "definition":
        if "what is" in s_lower:
            score += 3
        if " is a " in s_lower or " is an " in s_lower:
            score += 3
        if s_lower.startswith(term):
            score += 2
        if s_lower.startswith("a " + term) or s_lower.startswith("an " + term):
            score += 2
        if "statutory document" in s_lower:
            score += 2
        if "identifies land" in s_lower:
            score += 2
        if "applies additional controls" in s_lower:
            score += 2
        if "describes the requirements that apply" in s_lower:
            score += 2

    # Penalise obvious noise
    bad_starts = ["chapter", "page |", "figure", "table", "objector"]
    if any(s_lower.startswith(x) for x in bad_starts):
        score -= 4

    if "page |" in s_lower:
        score -= 4
    if "figure" in s_lower:
        score -= 3
    if len(s) > 700:
        score -= 2
    if len(s) < 20:
        score -= 2

    return score


def pick_best_sentence(df: pd.DataFrame, label: str, term: str) -> str:
    """
    Select the best sentence for a given label and term.
    """
    subset = df[
        (df["predicted_label"] == label)
        & (df["sentence"].str.lower().str.contains(term, na=False))
    ].copy()

    if subset.empty:
        return "Not specified"

    subset["custom_score"] = subset.apply(
        lambda row: sentence_quality_score(
            row["sentence"],
            term,
            label,
            row["confidence"]
        ),
        axis=1
    )

    subset = subset.sort_values(by="custom_score", ascending=False)
    best = subset.iloc[0]["sentence"]

    if pd.isna(best):
        return "Not specified"

    return best


def build_structured_records(prediction_df: pd.DataFrame, document_name: str) -> list[dict]:
    """
    Convert predicted sentence labels into structured records for each target term.
    """
    records = []

    for term in TARGET_TERMS:
        definition = pick_best_sentence(prediction_df, "definition", term)
        permit_info = pick_best_sentence(prediction_df, "permit_related", term)
        authority_sentence = pick_best_sentence(prediction_df, "authority", term)
        component_sentence = pick_best_sentence(prediction_df, "component", term)

        combined_text = " ".join([
            definition if definition != "Not specified" else "",
            permit_info if permit_info != "Not specified" else "",
            authority_sentence if authority_sentence != "Not specified" else "",
            component_sentence if component_sentence != "Not specified" else ""
        ]).strip()

        record = {
            "document_name": document_name,
            "term": term,
            "definition": definition,
            "purpose_or_function": infer_purpose(definition, term),
            "permit_related_information": permit_info,
            "authority_involved": extract_authority_names(
                authority_sentence if authority_sentence != "Not specified" else combined_text
            ),
            "related_components": extract_related_components(
                component_sentence if component_sentence != "Not specified" else combined_text
            ),
            "source_section": extract_source_section(combined_text)
        }

        records.append(record)

    return records