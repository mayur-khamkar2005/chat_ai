import ctypes
import os
import sys

from loader import load_intents
from matcher import find_best_match
from responder import choose_response
from utils import normalize_text


def get_engine():
    dll_path = os.path.join(os.path.dirname(__file__), 'nlp_engine.dll')
    try:
        nlp = ctypes.CDLL(dll_path)
        nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        nlp.match_pattern.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
        nlp.match_pattern.restype = ctypes.c_int
        return nlp
    except Exception as exc:
        print(f"Failed to load NLP engine: {exc}", file=sys.stderr)
        return None


nlp = get_engine()
INTENTS_DB, FALLBACK_DB = load_intents(os.path.join(os.path.dirname(__file__), 'data', 'intents'))


def generate_reply(message):
    if not nlp:
        return "Internal Error: NLP engine not loaded."

    normalized = normalize_text(message or "")
    if not normalized.strip():
        return "Please type a message."

    msg_bytes = normalized.encode('utf-8')
    out_buf = ctypes.create_string_buffer(1024)

    try:
        nlp.parse_message(msg_bytes, out_buf, 1024)
    except Exception as exc:
        print(f"NLP parse failed: {exc}", file=sys.stderr)
        return "I had trouble processing that message."

    parsed_text = out_buf.value.decode('utf-8', errors='ignore').strip()
    if not parsed_text:
        parsed_text = normalized

    best_intent = find_best_match(parsed_text, INTENTS_DB)
    fallback_intent = find_best_match(parsed_text, FALLBACK_DB)
    return choose_response(best_intent, fallback_intent)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        print(generate_reply(message))
    else:
        print(generate_reply(""))
