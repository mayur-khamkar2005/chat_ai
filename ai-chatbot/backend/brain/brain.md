# Brain Directory (AI Core)

This folder contains the actual intelligence of the chatbot! It uses a high-performance architecture utilizing both Python and C++.

## How it works
1. **`nlp_engine.cpp`**: This is the raw C++ file that holds the Natural Language Processing (NLP) rules. It parses text, normalizes sentences, and detects intents (e.g., Greetings, Goodbyes, Bad Words) using fast regular expressions.
2. **`nlp_engine.dll`**: This is the compiled version of the C++ file. It is statically linked, meaning it runs standalone on Windows without needing external C++ libraries.
3. **`brain.py`**: This Python script is the "orchestrator." It uses the `ctypes` library to load the `nlp_engine.dll`. When a message comes in, Python passes the text into the C++ engine, gets the detected intent back, and then returns the correct text reply.
