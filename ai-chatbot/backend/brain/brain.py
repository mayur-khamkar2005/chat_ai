import ctypes
import os
import sys

def get_engine():
    dll_path = os.path.join(os.path.dirname(__file__), 'nlp_engine.dll')
    try:
        nlp = ctypes.CDLL(dll_path)
        nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        nlp.detect_intent.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        nlp.detect_intent2.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
        return nlp
    except Exception as e:
        print(f"Failed to load NLP engine: {e}", file=sys.stderr)
        return None

nlp = get_engine()

def generate_reply(message):
    if not nlp:
        return "Internal Error: NLP engine not loaded."

    msg_bytes = (message or "").encode('utf-8')
    out_buf = ctypes.create_string_buffer(1024)
    
    nlp.parse_message(msg_bytes, out_buf, 1024)
    parsed_text = out_buf.value
    
    nlp.detect_intent(parsed_text, out_buf, 1024)
    intent = out_buf.value.decode('utf-8')
    
    nlp.detect_intent2(parsed_text, out_buf, 1024)
    intent2 = out_buf.value.decode('utf-8')
    
    if not parsed_text:
        return "Please type a message."
        
    if intent2 == "BADWORDS":
        return "Please use respectful language."
        
    if intent == "GREETING":
        return "Hello!"
        
    if intent == "WELLBEING":
        return "I'm doing great!"
        
    if intent == "GOODBYE":
        return "Goodbye! Have a nice day."
        
    if intent == "HELP":
        return "How can I help you?"
        
    if intent == "BOT_NAME":
        return "I was created by Mayur, so I don't have a name for my current state."
        
    if intent == "THANKS":
        return "You're welcome!"
    
    if intent == "NICE TO MEET YOU":
        return "nice to meet you to sir"
    
    if intent == "I AM SO SAD":
        return "sir i am hear for help"
    
        
    return "Sorry, I don't understand."

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Reconstruct the message from args if passed without quotes, but ideally it's quoted
        message = " ".join(sys.argv[1:])
        print(generate_reply(message))
    else:
        print(generate_reply(""))
