# NLP Engine

`nlp_engine.cpp` is the C++ part of the chatbot brain. It is compiled into `nlp_engine.dll`, and `brain.py` calls that DLL using Python `ctypes`.

## Why This File Exists

The NLP engine handles repeated text processing work:

- Cleaning user messages.
- Matching regex patterns.
- Detecting intent names.

Python then uses those intent names to choose the final reply.

## Exported Functions

The C++ file exposes three functions to Python.

### `parse_message`

Purpose: clean the raw user message before intent detection.

It currently:

- Converts text to lowercase.
- Replaces new lines and tabs with spaces.
- Converts smart quotes to normal quotes.
- Removes unsupported symbols.
- Collapses repeated spaces.
- Trims spaces from the start and end.

Example:

```txt
"  HELLO!!!  " -> "hello"
"How   are\nYOU???" -> "how are you"
"shut-up" -> "shut up"
```

### `detect_intent`

Purpose: detect normal chatbot intents.

Current intents:

| Intent | Example Messages |
| --- | --- |
| `GREETING` | hello, hy, hey, good morning |
| `WELLBEING` | how are you, what's up |
| `GOODBYE` | bye, goodbye, see you |
| `HELP` | help, can you help, need help |
| `BOT_NAME` | what is your name, who are you |
| `THANKS` | thanks, thank you |

### `detect_intent2`

Purpose: detect priority/safety intents.

Current intent:

| Intent | Example Messages |
| --- | --- |
| `BADWORDS` | bad/disrespectful language |

`brain.py` checks `BADWORDS` before normal intents, so safety replies take priority.

## How Python Calls C++

`brain.py` defines each function's argument types:

```python
nlp.parse_message.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
nlp.detect_intent.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
nlp.detect_intent2.argtypes = [ctypes.c_char_p, ctypes.c_char_p, ctypes.c_int]
```

Each C++ function receives:

1. Input text as `const char*`.
2. Output buffer as `char*`.
3. Maximum output length as `int`.

That is why the C++ code writes results into `output` instead of returning a `std::string`.

## Adding A New Pattern

Add normal user-intent patterns inside `detect_intent`.

Example:

```cpp
if (std::regex_search(text, std::regex("\\b(tell me a joke|joke)\\b", std::regex_constants::icase))) {
    strncpy(output, "JOKE", max_len); return;
}
```

Then add the reply in `brain.py`:

```python
if intent == "JOKE":
    return "Here is a joke."
```

Add priority/safety patterns inside `detect_intent2`.

## Rebuilding The DLL

After every change to `nlp_engine.cpp`, run:

```bash
g++ -shared -o nlp_engine.dll nlp_engine.cpp -static
```

Run the command from:

```txt
backend/brain
```

Then restart the backend server.

## Important Rules

- Intent names in C++ and Python must match exactly.
- Editing `brain.py` does not require rebuilding the DLL.
- Editing `nlp_engine.cpp` always requires rebuilding the DLL.
- If a reply exists in `brain.py` but C++ never returns that intent, the reply will never run.

