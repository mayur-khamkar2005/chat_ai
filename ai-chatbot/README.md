# AI Chatbot

This project is a high-performance AI Chatbot application featuring a React frontend and a polyglot backend designed for computational efficiency. The backend uses Node.js for routing, Python for orchestration, and a compiled C++ shared library for heavy NLP pattern matching.

## Architecture

- **Frontend (`/frontend`)**: A fast, modern React application built with Vite. It communicates with the backend via REST API.
- **Backend API (`/backend/app.js`)**: A Node.js Express server that receives requests from the frontend and delegates them to the NLP engine.
- **Orchestration (`/backend/brain/brain.py`)**: A Python script responsible for high-level NLP orchestration. It interfaces with the C++ DLL using `ctypes`.
- **NLP Engine (`/backend/brain/nlp_engine.cpp`)**: A computationally efficient regex-matching and string-parsing library written in C++ and compiled into a standalone shared library (`nlp_engine.dll`).

## Prerequisites

To run this project locally, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.8+ recommended)
- *(Optional)* **g++ Compiler**: Only required if you intend to modify and recompile the C++ NLP engine source code (`nlp_engine.cpp`).

## Setup Instructions

### 1. Backend Setup

The backend handles the routing and the AI logic processing.

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on port `5000` (e.g., `http://localhost:5000`). It automatically utilizes the included `nlp_engine.dll` and `brain.py` scripts for intent detection.*

### 2. Frontend Setup

The frontend provides the interactive chat interface.

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the React dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The terminal will display a local URL (usually `http://localhost:5173`). Open this URL in your web browser to interact with the chatbot.*

## Compiling the C++ Engine (Advanced)

If you make modifications to the `nlp_engine.cpp` intent logic, you must recompile the shared library. We recommend static linking to prevent missing DLL errors at runtime.

From the `backend/brain` directory, run:
```bash
g++ -shared -o nlp_engine.dll nlp_engine.cpp -static
```

## Technologies Used
- **Frontend**: React, Vite, CSS
- **Backend Routing**: Node.js, Express, Cors
- **AI Orchestration**: Python, `child_process.spawn`, `ctypes`
- **NLP Engine**: C++, standard regex (`<regex>`), statically compiled DLL
