# Brain Module

This folder is the chatbot's AI core. It uses three layers:

1. Node.js receives the frontend request.
2. Python decides which reply to send.
3. C++ handles fast text cleaning and intent detection.

## Files

### `brain.py`

This is the main brain orchestrator.

It does not directly detect every intent by itself. Instead, it:

1. Loads `nlp_engine.dll` with Python `ctypes`.
2. Sends the user message to C++ `parse_message`.
3. Sends the cleaned message to C++ `detect_intent`.
4. Sends the cleaned message to C++ `detect_intent2`.
5. Chooses the final chatbot reply from the detected intent.

Simple rule:

- C++ decides what the user means.
- Python decides what the bot says.

### `nlp_engine.cpp`

This is the source code for the NLP engine.

It contains:

- `parse_message`: cleans and normalizes user text.
- `detect_intent`: detects normal intents like greetings, help, goodbye, thanks, and bot-name questions.
- `detect_intent2`: detects special/priority intents like bad words.

### `nlp_engine.dll`

This is the compiled C++ engine used by `brain.py`.

Important: if you edit `nlp_engine.cpp`, the chatbot will not use your changes until you rebuild `nlp_engine.dll`.

## Request Flow

```txt
Frontend
  -> Backend route/controller
  -> brain.py
  -> nlp_engine.dll
  -> parse_message()
  -> detect_intent() and detect_intent2()
  -> brain.py returns reply
  -> Backend sends JSON response
  -> Frontend displays AI message
```

## Current Reachable Intents

These intents are returned by the C++ engine and handled in `brain.py`:

| Intent | Purpose |
| --- | --- |
| `BADWORDS` | User used disrespectful language |
| `GREETING` | hi, hello, hey, good morning |
| `WELLBEING` | how are you, what's up |
| `GOODBYE` | bye, goodbye, see you |
| `HELP` | help, assist, support |
| `BOT_NAME` | what is your name, who are you |
| `THANKS` | thanks, thank you |

Note: `brain.py` also contains replies for `NICE TO MEET YOU` and `I AM SO SAD`, but `nlp_engine.cpp` does not currently return those intents. To make them work, add matching rules in `nlp_engine.cpp`.

## How To Add A New Intent

1. Add a new regex rule in `nlp_engine.cpp`.
2. Return a clear intent name, for example `JOKE`.
3. Add a reply for that intent in `brain.py`.
4. Rebuild the DLL.
5. Restart the backend server.

Example:

```cpp
if (std::regex_search(text, std::regex("\\b(tell me a joke|joke)\\b", std::regex_constants::icase))) {
    strncpy(output, "JOKE", max_len); return;
}
```

Then in `brain.py`:

```python
if intent == "JOKE":
    return "Why did the developer go broke? Because he used up all his cache."
```

## Rebuild Command

Run this inside `backend/brain` after editing `nlp_engine.cpp`:

```bash
g++ -shared -o nlp_engine.dll nlp_engine.cpp -static
```

## Common Issues

### The bot says "Sorry, I don't understand."

Possible causes:

- No regex matched the message.
- The intent exists in `brain.py`, but C++ never returns it.
- You edited `nlp_engine.cpp` but did not rebuild `nlp_engine.dll`.
- The backend server is still running old code and needs restart.

### The bot says "Internal Error: NLP engine not loaded."

Possible causes:

- `nlp_engine.dll` is missing.
- The DLL failed to load.
- The DLL was compiled with missing runtime dependencies.

Use the static rebuild command above to avoid missing dependency problems on Windows.

