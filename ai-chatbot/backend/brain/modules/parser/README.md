# Parser Module

## Why this folder exists
The parser module exists to prepare user messages before the AI engine analyzes them. Raw input from users is often messy, inconsistent, or full of punctuation. The parser makes the text consistent so the rest of the system can reason about it more effectively.

## Responsibility
This module converts a raw input string into a clean structure that includes the original text, a normalized version, and a token list. It is responsible for preparing the message for downstream NLP and intent matching.

## How it connects to the rest of the AI
The parser sits at the front of the pipeline. It receives the user's message and forwards the processed form to the tokenizer and normalizer, then onward to the brain engine and intent matcher.

## Files in this folder
- parser.js: the entry point that parses a message.
- README.md: explains the module and its purpose.

## JavaScript concepts used here
- Pure functions.
- Module exports.
- Data transformation.
- Basic string processing.

## C++ concepts used here
The parser in JavaScript prepares data for the C++ NLP engine. The C++ side later performs more advanced preprocessing such as token cleanup, stop-word handling, and keyword extraction.

## Example input
"Hello there!!! How are you?"

## Example output
A parsed object containing the raw message, a normalized version, and a list of tokens.

## Data flow
1. Incoming text arrives.
2. The parser calls the normalizer.
3. A cleaned string is produced.
4. The cleaned text is split into tokens.
5. The results are passed to the next module.

## When this module is executed
This module runs once per user message.

## Future improvements
- Add sentence splitting.
- Add punctuation-aware parsing.
- Add entity extraction hooks.
- Add support for multi-language normalization.
