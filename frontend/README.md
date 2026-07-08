# Agentic Workflow Canvas

A premium, production-grade AI workflow builder. This full-stack application allows users to visually construct, connect, and validate complex Directed Acyclic Graphs (DAGs) for agentic execution. 

Built with **React 18**, **React Flow**, and **Tailwind CSS** on the frontend, powered by a **Python/FastAPI** graph-validation engine on the backend.

## ✨ Core Features

* **Dynamic Regex Pre-Processing:** Text nodes actively scan keystrokes using Regular Expressions to dynamically extract `{{ variables }}` and spawn active target dependencies in real-time.
* **Intelligent Graph Validation:** Backend integration utilizes a Graph Theory algorithm (Depth-First Search) to detect infinite loops and circular dependencies, ensuring only valid Directed Acyclic Graphs (DAGs) are executed.
* **Pre-Flight Client Checks:** The frontend actively monitors for empty canvases or isolated nodes, intercepting bad payloads before they hit the network layer.
* **Premium UX/UI Architecture:** 
  * Custom dark-zinc theme with emerald focus states.
  * Extensible, categorized node sidebar utilizing `lucide-react` iconography.
  * Auto-resizing nodes and animated SVG connection pathways.
  * Resizable, live-streaming system execution terminal.

## 🏗️ System Architecture

* **Frontend:** React 18, React Flow, Tailwind CSS, HeadlessUI.
* **Backend:** Python, FastAPI, Uvicorn.
* **Communication:** Asynchronous REST API utilizing serialized JSON payloads.

## 🚀 Getting Started

### 1. Start the FastAPI Backend
Navigate to the `/backend` directory and start the Uvicorn server:
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```
*The server will start on `http://localhost:8000`.*

### 2. Start the React Frontend
Navigate to the `/frontend` directory, install the dependencies, and launch the development server:
```bash
cd frontend
npm install
npm start
```
*The application will launch on `http://localhost:3000`.*

## 🧠 Design Philosophy
This canvas was engineered with a strict adherence to the **Single Responsibility Principle**. The `BaseNode` component abstracts away all visual rendering and React Flow handle mapping, allowing individual node types (LLM, Agent, VectorDB) to act as pure logic and state containers.
