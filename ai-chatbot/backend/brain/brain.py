import ctypes
import os
import sys
import json
import random

def get_engine():
    dll_path = os.path.join(os.path.dirname(__file__), 'nlp_engine.dll')
    try:
        nlp = ctypes.CDLL(dll_path)
        nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        nlp.match_pattern.argtypes = [ctypes.c_char_p, ctypes.c_char_p]
        nlp.match_pattern.restype = ctypes.c_int
        return nlp
    except Exception as e:
        print(f"Failed to load NLP engine: {e}", file=sys.stderr)
        return None

nlp = get_engine()

def load_intents():
    intents = []
    intents_dir = os.path.join(os.path.dirname(__file__), 'data', 'intents')
    if not os.path.exists(intents_dir):
        return intents
        
    for filename in os.listdir(intents_dir):
        if filename.endswith('.json'):
            try:
                with open(os.path.join(intents_dir, filename), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data.get('intent') == 'BADWORDS':
                        intents.insert(0, data) # Highest priority
                    else:
                        intents.append(data)
            except Exception as e:
                print(f"Failed to load {filename}: {e}", file=sys.stderr)
                
    return intents

INTENTS_DB = load_intents()

def generate_reply(message):
    if not nlp:
        return "Internal Error: NLP engine not loaded."

    msg_bytes = (message or "").encode('utf-8')
    out_buf = ctypes.create_string_buffer(1024)
    
    nlp.parse_message(msg_bytes, out_buf, 1024)
    parsed_text_bytes = out_buf.value
    parsed_text_str = parsed_text_bytes.decode('utf-8')
    
    if not parsed_text_str.strip():
        return "Please type a message."
        
    for intent_data in INTENTS_DB:
        patterns = intent_data.get('patterns', [])
        for pattern in patterns:
            pattern_bytes = pattern.encode('utf-8')
            if nlp.match_pattern(parsed_text_bytes, pattern_bytes):
                responses = intent_data.get('responses', [])
                if responses:
                    return random.choice(responses)
                return f"Intent {intent_data.get('intent')} matched, but no response found."

    return "Sorry, I don't understand."

if __name__ == "__main__":
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        print(generate_reply(message))
    else:
        print(generate_reply(""))
