# Normalization Module

## Why this folder exists
The normalization module exists to make text easier for the bot to analyze. Users often write messages with inconsistent casing, extra spaces, punctuation, or symbols. Normalization reduces that noise before matching logic runs.

## Responsibility
This module cleans and standardizes input so the AI can compare text consistently.

## How it connects to the rest of the AI
The parser uses this module to prepare the text before it reaches the tokenizer and matcher.

## Files in this folder
- normalizer.js: contains text normalization helpers.
- README.md: explains the module.

## JavaScript concepts used here
- String processing.
- Regular expressions.
- Pure functions.

## C++ concepts used here
The C++ NLP engine also normalizes text, which makes the JavaScript layer faster and more predictable.

## Example input
"  HELLO!!!   HOW ARE YOU?  "

## Example output
"hello how are you"

## Data flow
1. Raw text enters the module.
2. It is converted to lowercase.
3. Extra spaces are removed.
4. Unwanted characters are stripped.
5. The cleaned text is returned.

## When this module is executed
It runs whenever the parser needs a cleaned version of the message.

## Future improvements
- Add emoji removal.
- Add accent normalization.
- Add language-specific cleanup.
