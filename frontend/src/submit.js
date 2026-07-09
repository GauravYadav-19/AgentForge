// submit.js

import { useState, useEffect } from 'react';
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
    const budget = useStore((state) => state.budget);

    const [logs, setLogs] = useState([]);
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [secrets, setSecrets] = useState(() => {
        const saved = localStorage.getItem('vault-secrets');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('vault-secrets', JSON.stringify(secrets));
    }, [secrets]);

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
            alert("Canvas is empty. Please add nodes before running the pipeline.");
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

        // Validation Check 3: Empty Webhook URLs
        const invalidWebhooks = nodes.filter(n => n.type === 'webhook' && (!n.data.URL || n.data.URL.trim() === '' || n.data.URL === 'https://'));
        if (invalidWebhooks.length > 0) {
            alert("One or more API Webhook nodes are missing a valid URL. Please fix them before running.");
            addLog({ level: 'ERROR', component: 'canvas', message: 'API Webhook missing valid URL. Pipeline aborted.' });
            return;
        }

        addLog({ level: 'INFO', component: 'pre-flight', message: 'Pre-flight validation passed. Sending payload to Policy Enforcement Point...' });

        const secretsDict = secrets.reduce((acc, secret) => {
            if (secret.key && secret.value) {
                acc[secret.key] = secret.value.trim();
            }
            return acc;
        }, {});

        const payload = {
            nodes,
            edges,
            secrets: secretsDict,
            governance: {
                max_budget: parseFloat(budget || 0),
                tier: "enterprise"
            }
        };

        try {
            const response = await fetch('https://agentforge-engine-abcd.onrender.com/pipelines/execute', {
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

            addLog({ level: 'DAG', component: 'graph', message: `Execution Engine initialized. Path cleared.` });

            // Dispatch execution trace logs
            if (data.trace && data.trace.length > 0) {
                data.trace.forEach((t, i) => {
                    setTimeout(() => {
                        addLog({ level: t.level, component: t.component || 'engine', message: t.message });
                    }, (i + 1) * 400); // Stagger logs for a streaming effect
                });

                // Dispatch final success log
                setTimeout(() => {
                    addLog({ level: 'SUCCESS', component: 'system', message: 'Pipeline executed successfully. Final states calculated.' });
                    console.log("Final State:", data.final_state);
                    alert("Pipeline Executed Successfully!");
                }, (data.trace.length + 1) * 400);
            } else {
                addLog({ level: 'SUCCESS', component: 'system', message: 'Pipeline executed successfully, but no trace was returned.' });
                alert("Pipeline Executed Successfully!");
            }

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
                    onClick={() => {
                        const data = JSON.stringify({ nodes, edges }, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'aegisflow-pipeline.json';
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className="rounded-md border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-500 shadow-lg transition-all hover:bg-emerald-900/30 hover:scale-105"
                >
                    Export JSON
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
            <SecretsVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} secrets={secrets} setSecrets={setSecrets} />
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
