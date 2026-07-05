# Tokenizer Module

## Why this folder exists
The tokenizer module exists to break down text into smaller pieces that the AI engine can process. It turns a sentence into tokens so the system can examine words individually and match them against patterns more effectively.

## Responsibility
This module converts a normalized message into a list of meaningful tokens.

## How it connects to the rest of the AI
The parser uses the tokenizer after normalization. The resulting tokens can be used for matching, intent evaluation, or future reasoning.

## Files in this folder
- tokenizer.js: provides tokenization helpers.
- README.md: documents the module.

## JavaScript concepts used here
- Array creation.
- Regex-based splitting.
- String handling.

## C++ concepts used here
The tokenizer complements the preprocessing done by the C++ NLP engine.

## Example input
"hello there how are you"

## Example output
["hello", "there", "how", "are", "you"]

## Data flow
1. The parser passes a normalized sentence.
2. The tokenizer splits the message into words.
3. The output tokens are returned for later analysis.

## When this module is executed
It runs after normalization and before matching.

## Future improvements
- Add stemming or lemmatization support.
- Add punctuation-aware token handling.
- Add stop-word filtering.
