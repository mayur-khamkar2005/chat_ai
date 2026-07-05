import random
from typing import Optional

from intent import Intent
from utils import choose_random


def choose_response(intent: Optional[Intent], fallback_intent: Optional[Intent] = None) -> str:
    if intent and intent.responses:
        return choose_random(intent.responses)

    if fallback_intent and fallback_intent.responses:
        return choose_random(fallback_intent.responses)

    return "I'm here to help. Could you ask that another way?"
