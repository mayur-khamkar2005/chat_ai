# Backend Architecture Overview

## Overview
The backend is organized as a modular offline AI chatbot architecture. Each responsibility lives in a dedicated module so the system stays maintainable as it grows.

## Main Flow
User -> Controller -> Brain Engine -> Parser -> Normalizer -> Tokenizer -> Intent Loader -> Pattern Matcher -> Response Generator -> Frontend

## Responsibilities
- Controller: receive the incoming request and return the reply.
- Brain Engine: orchestrate the whole request pipeline.
- Parser: prepare incoming text for downstream processing.
- Normalizer: clean and standardize the input.
- Tokenizer: split the text into tokens.
- Intent Loader: discover and load intent JSON files recursively.
- Pattern Matcher: score the input against available intent patterns.
- Response Generator: select the best reply for the matched intent.

## Design Goals
- Keep modules independent and focused.
- Keep the system data-driven through JSON intents.
- Support future expansion with memory, context, and reasoning modules.
- Preserve an offline architecture without cloud dependencies.

## Extension Areas
The current architecture already leaves room for future enhancements such as:
- memory and conversation state
- entity extraction
- safety and moderation layers
- fuzzy and synonym matching
- reasoning and personality modules
