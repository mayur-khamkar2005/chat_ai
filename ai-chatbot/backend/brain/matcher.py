from typing import List, Optional

from intent import Intent


def find_best_match(text: str, intents: List[Intent]) -> Optional[Intent]:
    """Return the highest-scoring intent that matches the cleaned text."""
    if not text or not intents:
        return None

    best_intent: Optional[Intent] = None
    best_score = -1

    for intent in intents:
        score = intent.score(text)
        if score > best_score:
            best_intent = intent
            best_score = score

    if best_score <= 0:
        return None
    return best_intent
