from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

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
