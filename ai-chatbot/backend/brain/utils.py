import json
import os
import random
import re
from typing import Any, Dict, List


def normalize_text(text: str) -> str:
    """Clean and normalize user input for consistent matching."""
    if not text:
        return ""

    text = text.strip()
    text = text.replace("\r", " ").replace("\n", " ")
    text = text.replace("’", "'").replace("“", '"').replace("”", '"')
    text = re.sub(r"\s+", " ", text)
    return text.lower()


def load_json_file(file_path: str) -> Dict[str, Any]:
    with open(file_path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def choose_random(responses: List[str]) -> str:
    if not responses:
        return ""
    return random.choice(responses)


def ensure_list(value: Any) -> List[str]:
    if isinstance(value, list):
        return [str(item) for item in value if item is not None]
    return []
