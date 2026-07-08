# Agentic Workflow Canvas 🧠
A production-grade, full-stack visual node editor designed for orchestrating multi-agent AI pipelines, LLM prompts, and dynamic tool-calling.

## 🚀 Architecture & Core Features
* **Visual DAG Orchestration:** Built with React Flow, allowing users to drag, drop, and wire AI nodes (LLMs, Agents, Prompts) into complex Directed Acyclic Graphs (DAGs).
* **Dynamic Regex Parsing:** The frontend features real-time keystroke parsing. When a user types `{{variable}}` inside a node, the UI instantly generates a target handle for visual wiring.
* **Backend Cycle Detection:** Powered by a Python/FastAPI backend utilizing a Depth-First Search (DFS) algorithm to proactively catch circular dependencies, preventing infinite LLM execution loops.
* **Decoupled Node Abstraction:** Engineered a single `BaseNode` wrapper to handle all styling, state management, and React Flow mappings, keeping the UI completely decoupled from business logic.

## 🏢 Enterprise AI Governance Upgrades
* **Policy Enforcement Point (Guardrail Node):** Strict data compliance and latency constraint configurations.
* **Pre-Flight Token & Cost Auditing:** A real-time overlay widget analyzing node combinations to project execution costs against global budgets, throwing 403 Forbidden on budget breaches.
* **Structured Telemetry Terminal:** JSON-based streaming execution logs color-coded for distinct intent and governance tracking.
* **Global Secrets Vault:** A dedicated, visually distinct secure drawer for managing API keys.
* **Pipeline Version Control:** Built-in ability to commit the current pipeline state and restore previous graphs instantly from `localStorage`.
* **Semantic Router & Sub-Flows:** Advanced conditional branching capabilities and dynamic Compound Bounding Box node groupings.
* **Pydantic Validation Engine:** Robust backend schemas that validate every node and edge payload entering the system before calculation.

## 🛠️ Tech Stack
* **Frontend:** React, Tailwind, React Flow, Zustand, Lucide-React
* **Backend:** Python, FastAPI, Uvicorn, Pydantic
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
