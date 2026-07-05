# Matcher Module

## Why this folder exists
The matcher module exists to decide which intent best fits a user message. It compares the cleaned input against each intent's patterns and produces a ranked result.

## Responsibility
This module is the decision engine for intent selection. It uses regular expressions, scoring, and confidence estimates to decide which intent deserves the response.

## How it connects to the rest of the AI
The matcher receives the normalized text and the list of intents from the loader. It returns a match result to the brain, which then passes that information to the response generator.

## Files in this folder
- patternMatcher.js: contains the matching logic.
- README.md: explains the purpose of the matcher module.

## JavaScript concepts used here
- Regular expressions.
- Array iteration.
- Scoring logic.
- Simple confidence calculation.

## C++ concepts used here
The JavaScript matcher benefits from textual preprocessing done by the C++ NLP engine, which makes matching more efficient and consistent.

## Example input
Text: "I need help with React"

## Example output
A matching result for the REACT or HELP intent with a confidence score.

## Data flow
1. The brain sends normalized input.
2. The matcher evaluates each intent.
3. It checks each pattern.
4. The best-scoring match is selected.
5. The match result is returned.

## When this module is executed
This module runs on every message after parsing and normalization.

## Future improvements
- Add fuzzy matching.
- Add synonym-aware matching.
- Add weighted pattern scoring.
- Add context-based ranking.
