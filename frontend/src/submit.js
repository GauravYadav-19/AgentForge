// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { Terminal } from './Terminal';
import { SecretsVault } from './SecretsVault';
import { VersionHistory } from './VersionHistory';
import { Key, History } from 'lucide-react';

export const SubmitButton = () => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const setNodes = useStore((state) => state.setNodes);
    const setEdges = useStore((state) => state.setEdges);
    
    const [logs, setLogs] = useState([]);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const addLog = (logObj) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });
        setLogs((prev) => [...prev, { timestamp, ...logObj }]);
    };

    const handleSubmit = async () => {
        setLogs([]);
        setIsTerminalOpen(true);
        
        addLog({ level: 'AUDIT', component: 'pre-flight', message: 'Init pre-flight schema validation...' });

        // Validation Check 1: Empty Canvas
        if (nodes.length === 0) {
            addLog({ level: 'ERROR', component: 'canvas', message: 'Canvas is empty. Pipeline aborted.' });
            return;
        }

        // Validation Check 2: Isolated Nodes
        const connectedNodeIds = new Set();
        edges.forEach(edge => {
            connectedNodeIds.add(edge.source);
            connectedNodeIds.add(edge.target);
        });
        
        const isolatedNodes = nodes.filter(node => !connectedNodeIds.has(node.id));
        if (isolatedNodes.length > 0) {
            addLog({ level: 'WARNING', component: 'canvas', message: 'Isolated nodes detected. Proceeding with caution.' });
        }

        addLog({ level: 'INFO', component: 'pre-flight', message: 'Pre-flight validation passed. Sending payload to Policy Enforcement Point...' });

        const payload = {
            nodes,
            edges,
            governance: {
                max_budget: 0.1, // Fixed budget for demonstration
                tier: "enterprise"
            }
        };
        
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();

            if (!response.ok) {
                addLog({ level: 'ERROR', component: 'governance', message: data.detail || 'Governance gate rejected the payload.' });
                return;
            }

            // Simulate streaming delays
            setTimeout(() => {
                addLog({ level: 'DAG', component: 'graph', message: `Graph Parsed. Nodes: ${data.num_nodes}, Edges: ${data.num_edges}` });
                addLog({ level: 'GOVERNANCE', component: 'budget', message: `Cost Analysis: Estimated cost is $${data.estimated_cost.toFixed(4)}. Governance Status: ${data.governance_status}` });
                
                setTimeout(() => {
                    if (data.is_dag) {
                        addLog({ level: 'DAG', component: 'verification', message: 'DFS verification: 0 cycles detected. Path cleared.' });
                        addLog({ level: 'INTENT', component: 'system', message: 'System intent aligned with enterprise threshold. Execution SAFE.' });
                    } else {
                        addLog({ level: 'ERROR', component: 'verification', message: 'DFS verification: Circular dependency detected!' });
                    }
                }, 800);
            }, 800);

        } catch (error) {
            console.error(error);
            addLog({ level: 'ERROR', component: 'network', message: 'Error submitting pipeline. Ensure backend is running.' });
        }
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                <button 
                    type="button" 
                    onClick={() => setIsHistoryOpen(true)} 
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400 shadow-lg"
                >
                    <History className="w-4 h-4" /> History
                </button>
                <button 
                    type="button" 
                    onClick={() => setIsVaultOpen(true)} 
                    className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400 shadow-lg"
                >
                    <Key className="w-4 h-4" /> Secrets Vault
                </button>
                <button 
                    type="button" 
                    onClick={handleSubmit} 
                    className="rounded-md bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 hover:scale-105"
                >
                    Run Pipeline
                </button>
            </div>
            <Terminal logs={logs} isOpen={isTerminalOpen} onToggle={() => setIsTerminalOpen(!isTerminalOpen)} />
            <SecretsVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />
            <VersionHistory 
                nodes={nodes} 
                edges={edges} 
                setNodes={setNodes} 
                setEdges={setEdges} 
                isOpen={isHistoryOpen} 
                setIsOpen={setIsHistoryOpen} 
            />
        </>
    );
}
