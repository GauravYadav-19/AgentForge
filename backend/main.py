from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import time
import json
import re
import urllib.request
import urllib.error
import urllib.parse
from collections import defaultdict, deque

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class Edge(BaseModel):
    id: str
    source: str
    target: str

class GovernanceConfig(BaseModel):
    max_budget: float
    tier: str = "standard"

class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
    governance: GovernanceConfig
    secrets: dict = {}

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Cost Calculation engine
    total_cost = 0.0
    for node in nodes:
        if node.type == 'llm':
            total_cost += 0.05
        elif node.type == 'vectorDb':
            total_cost += 0.02
        elif node.type == 'agent':
            total_cost += 0.10
        elif node.type in ['customInput', 'customOutput']:
            total_cost += 0.0015
        else:
            total_cost += 0.00
            
    # Governance Gate
    if total_cost > payload.governance.max_budget:
        raise HTTPException(
            status_code=403, 
            detail=f"Governance Violation: Pipeline execution cost (${total_cost:.4f}) exceeds allocated budget (${payload.governance.max_budget:.4f})."
        )
    
    # Create adjacency list
    adj_list = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adj_list:
            adj_list[edge.source].append(edge.target)
            
    # DFS to detect cycles
    visited = set()
    rec_stack = set()
    
    def dfs(node_id):
        visited.add(node_id)
        rec_stack.add(node_id)
        
        for neighbor in adj_list.get(node_id, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
                
        rec_stack.remove(node_id)
        return False
        
    is_dag = True
    for node in nodes:
        node_id = node.id
        if node_id not in visited:
            if dfs(node_id):
                is_dag = False
                break
                
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
        "estimated_cost": total_cost,
        "governance_status": "PASSED"
    }

def topological_sort(nodes, edges):
    in_degree = {node.id: 0 for node in nodes}
    adj_list = {node.id: [] for node in nodes}
    
    for edge in edges:
        if edge.source in adj_list:
            adj_list[edge.source].append(edge.target)
        if edge.target in in_degree:
            in_degree[edge.target] += 1
            
    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])
    topo_order = []
    
    while queue:
        curr = queue.popleft()
        topo_order.append(curr)
        for neighbor in adj_list.get(curr, []):
            if neighbor in in_degree:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
                    
    return topo_order

@app.post('/pipelines/execute')
def execute_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges
    
    # Step 1: Budget governance check
    total_cost = 0.0
    for node in nodes:
        if node.type == 'llm': total_cost += 0.05
        elif node.type == 'vectorDb': total_cost += 0.02
        elif node.type == 'agent': total_cost += 0.10
        elif node.type in ['customInput', 'customOutput']: total_cost += 0.0015
            
    if total_cost > payload.governance.max_budget:
        raise HTTPException(
            status_code=403, 
            detail=f"Governance Violation: Pipeline execution cost (${total_cost:.4f}) exceeds allocated budget (${payload.governance.max_budget:.4f})."
        )
        
    # Step 2: Cycle detection
    adj_list = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adj_list:
            adj_list[edge.source].append(edge.target)
            
    visited = set()
    rec_stack = set()
    def dfs(node_id):
        visited.add(node_id)
        rec_stack.add(node_id)
        for neighbor in adj_list.get(node_id, []):
            if neighbor not in visited:
                if dfs(neighbor): return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node_id)
        return False
        
    for node in nodes:
        if node.id not in visited:
            if dfs(node.id):
                raise HTTPException(status_code=400, detail="Cycle detected in the pipeline graph.")

    # Step 3: Get execution sequence
    seq = topological_sort(nodes, edges)
    
    # Step 4: Initialize execution context and trace
    execution_context = {}
    execution_trace = []
    
    node_map = {n.id: n for n in nodes}
    
    # Step 5: Loop through sorted node IDs
    for node_id in seq:
        if node_id not in node_map:
            continue
        node = node_map[node_id]
        
        execution_trace.append({"level": "INFO", "component": "engine", "message": f"Executing Node {node.id} ({node.type})"})
        
        # Find previous output
        previous_output = ""
        for edge in edges:
            if edge.target == node.id and edge.source in execution_context:
                previous_output = execution_context[edge.source]
                break
                
        output = ""
        if node.type in ('input', 'customInput'):
            output = node.data.get('Name', 'default_input')
        elif node.type == 'text':
            output = str(previous_output) + " " + str(node.data.get('text', ''))
        elif node.type == 'llm':
            api_key = payload.secrets.get("GEMINI_API_KEY", "").strip()
            
            if not api_key:
                output = "[SECURITY] Missing GEMINI_API_KEY in Vault. Using deterministic fallback."
                execution_trace.append({"level": "WARNING", "component": "security", "message": output})
            else:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                data = {
                    "contents": [{
                        "parts": [{"text": str(previous_output)}]
                    }]
                }
                headers = {"Content-Type": "application/json"}
                
                try:
                    import httpx
                    execution_trace.append({"level": "INFO", "component": "network", "message": "[NETWORK] Contacting Gemini API..."})
                    res = httpx.post(url, headers=headers, json=data, timeout=30.0)
                    
                    if res.status_code == 200:
                        gemini_response = res.json()
                        output = gemini_response["candidates"][0]["content"]["parts"][0]["text"]
                        execution_trace.append({"level": "INFO", "component": "network", "message": "[SUCCESS] Gemini API returned a valid response."})
                    else:
                        output = f"[NETWORK] Gemini API HTTP {res.status_code}: {res.text}"
                        execution_trace.append({"level": "ERROR", "component": "network", "message": output})
                        
                except Exception as e:
                    output = f"[NETWORK] Request completely failed: {str(e)}"
                    execution_trace.append({"level": "ERROR", "component": "network", "message": output})
                
        elif node.type == 'vectorDb':
            collection = node.data.get('Collection', 'internal_docs')
            execution_trace.append({"level": "INFO", "component": "rag", "message": f"[RAG] Querying vector collection '{collection}' for semantic matches..."})
            retrieved_context = "Enterprise Policy: All refunds above $500 require manual HITL (Human-in-the-Loop) authorization."
            output = f"Context Retrieved from {collection}: '{retrieved_context}'. Applied to query: {previous_output}"
            
        elif node.type == 'webhook':
            url = node.data.get('URL') or node.data.get('url') or ""
            if not url.strip() or url.strip() == "https://":
                raise ValueError("Webhook URL cannot be empty. Please configure the node.")
            method = node.data.get('Method', 'POST').upper()
            execution_trace.append({"level": "INFO", "component": "network", "message": f"[ACTION] Firing {method} request to external Webhook: {url}"})
            
            try:
                import httpx
                if method == 'POST':
                    res = httpx.post(url, json={"agent_payload": previous_output}, timeout=30.0)
                else:
                    res = httpx.get(url, params={"data": previous_output}, timeout=30.0)
                    
                output = f"Webhook Success (HTTP {res.status_code})"
                execution_trace.append({"level": "INFO", "message": output})
            except Exception as e:
                output = f"Webhook Failed: {str(e)}"
                execution_trace.append({"level": "ERROR", "component": "network", "message": output})
                
        elif node.type == 'router':
            condition = node.data.get('Condition') or node.data.get('condition') or node.data.get('text') or node.data.get('value') or ''
            try:
                if condition:
                    result = bool(re.search(condition, str(previous_output), re.IGNORECASE))
                else:
                    result = False
            except Exception:
                result = False
            execution_trace.append({"level": "DECISION", "component": "router", "message": f"[DECISION] Router evaluated condition '{condition}'. Result: {result}"})
            output = result
            
        elif node.type in ('output', 'customOutput'):
            output = f"Final Output: {previous_output}"
            execution_trace.append({"level": "INFO", "message": f"[PIPELINE COMPLETE] Final Output: {previous_output}"})
            
        else:
            output = f"Processed {node.type} with input '{previous_output}'"
            
        execution_context[node.id] = output
        
    return {
        "status": "success", 
        "trace": execution_trace, 
        "final_state": execution_context
    }
