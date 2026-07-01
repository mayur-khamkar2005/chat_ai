# Brain Module Update: Dynamic Intent Detection Pattern

This document explains the new architecture for intent detection in the NLP engine. The system has been upgraded from hardcoded intents to a dynamic, data-driven pattern.

## What Changed?

Previously, adding a new intent required:
1. Writing C++ regex code in `nlp_engine.cpp`.
2. Recompiling `nlp_engine.dll`.
3. Adding new `if` statements in `brain.py`.

Now, intents are stored as **JSON configuration files** inside `data/intents/`. 

- **Data Driven**: You do not need to touch C++ or Python code to add new knowledge to the bot.
- **`nlp_engine.cpp`**: Has been refactored into a generic text cleaner and fast regex matcher. It no longer contains hardcoded rules.
- **`brain.py`**: Now dynamically loads all JSON files on startup. When a user sends a message, it uses the C++ regex matcher to scan through the loaded patterns.

## The New Folder Structure

```text
backend/brain/
│
├── data/                       # Contains all data/knowledge
│   └── intents/                # Put your JSON intent files here
│       ├── greeting.json       
│       ├── wellbeing.json      
│       ├── badwords.json       # Prioritized automatically
│       └── ...
│
├── core/                       
│   ├── nlp_engine.cpp          # The fast C++ text matcher
│   ├── nlp_engine.dll          # The compiled DLL used by Python
│   └── brain.py                # Main script: loads JSONs and uses DLL
│
└── update.md                   # This explanation file
```
*(Note: all core scripts like `brain.py`, `nlp_engine.cpp`, and `nlp_engine.dll` remain in the root `backend/brain/` folder for backward compatibility with the Node.js backend).*

## How to Add a New Intent

To teach the bot a new response, just create a new JSON file inside the `data/intents/` folder.

**Example: `data/intents/joke.json`**
```json
{
  "intent": "JOKE",
  "patterns": [
    "\\b(tell me a joke|joke)\\b"
  ],
  "responses": [
    "Why did the developer go broke? Because he used up all his cache.",
    "There are 10 types of people in the world: those who understand binary, and those who don't."
  ]
}
```

- `patterns`: An array of regular expressions. If any pattern matches the user's text, the intent is triggered. Make sure to escape backslashes (e.g., `\\b` for word boundary).
- `responses`: An array of string responses. The bot will pick one at random.

**You do NOT need to recompile anything.** Just restart your Node.js backend server, and the Python script will load the new JSON file automatically!

## Priority System

The system automatically prioritizes the `BADWORDS` intent so safety replies always trigger first. If you want other intents to be checked first, you can modify the `load_intents()` function in `brain.py`.
