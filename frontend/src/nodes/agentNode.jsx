// agentNode.jsx
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const AgentNode = ({ id, data, selected }) => {
  const [persona, setPersona] = useState(data?.persona || 'You are a helpful assistant.');
  const [maxIterations, setMaxIterations] = useState(data?.maxIterations || 5);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-instruction`, style: { top: `${100/3}%` } },
    { type: 'target', position: Position.Left, id: `${id}-tools`, style: { top: `${200/3}%` } },
    { type: 'source', position: Position.Right, id: `${id}-action` }
  ];

  const handlePersonaChange = (e) => {
    setPersona(e.target.value);
    updateNodeField(id, 'persona', e.target.value);
  };

  const handleMaxIterChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setMaxIterations(val);
    updateNodeField(id, 'maxIterations', val);
  };

  return (
    <BaseNode id={id} title="AI Agent" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Agent Persona:
        <textarea 
          value={persona} 
          onChange={handlePersonaChange} 
          rows="3"
          style={{ minHeight: '100px', resize: 'vertical' }}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Max Iterations:
        <input 
          type="number" 
          value={maxIterations} 
          onChange={handleMaxIterChange} 
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
