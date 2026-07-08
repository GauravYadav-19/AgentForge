import React, { useState, useEffect } from 'react';
import { History, Save, RotateCcw, X, Clock } from 'lucide-react';

export const VersionHistory = ({ nodes, edges, setNodes, setEdges, isOpen, setIsOpen }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('pipeline-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse pipeline history from local storage.", error);
      }
    }
  }, []);

  const createCommit = () => {
    const newCommit = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    const newHistory = [newCommit, ...history];
    setHistory(newHistory);
    localStorage.setItem('pipeline-history', JSON.stringify(newHistory));
  };

  const restoreCommit = (commit) => {
    if (window.confirm('Are you sure you want to restore this version? Current unsaved changes will be lost.')) {
      setNodes(commit.nodes);
      setEdges(commit.edges);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}>
      <div className="absolute right-0 top-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 p-5 shadow-2xl transform transition-transform translate-x-0 flex flex-col">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-500" />
            Version History
          </h2>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={createCommit}
          className="flex items-center justify-center gap-2 w-full rounded-md bg-emerald-600/20 border border-emerald-600/50 px-4 py-2.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-lg mb-6"
        >
          <Save className="w-4 h-4" /> Commit Current State
        </button>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
          {history.length === 0 ? (
            <div className="text-center text-xs text-zinc-500 mt-10 font-mono">
              No previous versions found.
            </div>
          ) : (
            history.map((commit) => (
              <div key={commit.id} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 flex flex-col gap-2 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between text-zinc-300 font-mono text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{commit.timestamp}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="text-[10px] text-zinc-500 tracking-wider">
                    {commit.nodes.length} NODES • {commit.edges.length} EDGES
                  </div>
                  <button 
                    onClick={() => restoreCommit(commit)}
                    className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 hover:text-emerald-400 transition-colors bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded"
                    title="Restore this version"
                  >
                    <RotateCcw className="w-3 h-3" /> Restore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
