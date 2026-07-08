# Agentic Workflow Canvas 🧠
A production-grade, full-stack visual node editor designed for orchestrating multi-agent AI pipelines, LLM prompts, and dynamic tool-calling.

## 🚀 Architecture & Core Features
* **Visual DAG Orchestration:** Built with React Flow, allowing users to drag, drop, and wire AI nodes (LLMs, Agents, Prompts) into complex Directed Acyclic Graphs (DAGs).
* **Dynamic Regex Parsing:** The frontend features real-time keystroke parsing. When a user types `{{variable}}` inside a node, the UI instantly generates a target handle for visual wiring.
* **Backend Cycle Detection:** Powered by a Python/FastAPI backend utilizing a Depth-First Search (DFS) algorithm to proactively catch circular dependencies, preventing infinite LLM execution loops.
* **Decoupled Node Abstraction:** Engineered a single `BaseNode` wrapper to handle all styling, state management, and React Flow mappings, keeping the UI completely decoupled from business logic.

## 🛠️ Tech Stack
* **Frontend:** React, Next.js, Tailwind, React Flow
* **Backend:** Python, FastAPI, Uvicorn
* **Algorithms:** Depth-First Search (DFS), Regex Tokenization

## 🎥 Demo
https://drive.google.com/file/d/14xbLRm7gpGjf6nhB8gKDlV_2OnEbwK6t/view?usp=sharing

## ⚙️ Local Setup
### Prerequisites
- Node.js (v18+)
- Python (3.9+)

### 1. Start the Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Start the Frontend (React)
```bash
cd frontend
npm install
npm start
```
