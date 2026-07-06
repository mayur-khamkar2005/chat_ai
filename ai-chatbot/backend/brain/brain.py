import ctypes
import os
import sys
import random

from loader import load_intents

MAX_MESSAGE_LEN = 2000  # hard cap on input size before it ever reaches the DLL

def get_engine():
    dll_path = os.path.join(os.path.dirname(__file__), 'nlp_engine.dll')
    try:
        nlp = ctypes.CDLL(dll_path)
        nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        nlp.parse_message.restype = None  # it's a void function

        nlp.match_pattern.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
        nlp.match_pattern.restype = ctypes.c_int
        return nlp
    except Exception as e:
        print(f"Failed to load NLP engine: {e}", file=sys.stderr)
        return None

nlp = get_engine()

# Use loader.py to recursively load intent JSONs, respecting priority and enabled flags
INTENTS_DIR = os.path.join(os.path.dirname(__file__), 'data', 'intents')
INTENTS_DB, FALLBACK_DB = load_intents(INTENTS_DIR)

def _safe_parse(message: str) -> str:
    """Call into the DLL's parse_message with defensive error handling."""
    msg_bytes = message.encode('utf-8', errors='replace')
    out_buf = ctypes.create_string_buffer(1024)

    try:
        nlp.parse_message(msg_bytes, out_buf, 1024)
    except Exception as e:
        print(f"parse_message call failed: {e}", file=sys.stderr)
        return ""

    # errors='replace' is a belt-and-suspenders fallback; the DLL now
    # truncates on a UTF-8 boundary so this shouldn't normally trigger.
    return out_buf.value.decode('utf-8', errors='replace')

def generate_reply(message):
    if not nlp:
        return "Internal Error: NLP engine not loaded."

    message = (message or "")[:MAX_MESSAGE_LEN]

    parsed_text_str = _safe_parse(message)
    if not parsed_text_str.strip():
        return "Please type a message."

    # Match against primary intents (already sorted by priority)
    for intent in INTENTS_DB:
        if intent.match(parsed_text_str) > 0:
            if intent.responses:
                return random.choice(intent.responses)
            return f"Intent {intent.intent} matched, but no response found."

    # Match against fallback intents if no primary intent matches
    for intent in FALLBACK_DB:
        if intent.match(parsed_text_str) > 0:
            if intent.responses:
                return random.choice(intent.responses)

    return "Sorry, I don't understand."

if __name__ == "__main__":
    if len(sys.argv) > 1: 
        message = " ".join(sys.argv[1:])
        print(generate_reply(message))
    else:
        print(generate_reply(""))