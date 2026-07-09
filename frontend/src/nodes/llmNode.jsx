// llmNode.jsx
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4o');
  const [temperature, setTemperature] = useState(data?.temperature || 0.7);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-system-context`, style: { top: `${100/3}%` } },
    { type: 'target', position: Position.Left, id: `${id}-user-prompt`, style: { top: `${200/3}%` } },
    { type: 'source', position: Position.Right, id: `${id}-response` }
  ];

  const handleModelChange = (e) => {
    const val = e.target.value;
    setModel(val);
    updateNodeField(id, 'model', val);
  };

  const handleTempChange = (e) => {
    const val = parseFloat(e.target.value);
    setTemperature(val);
    updateNodeField(id, 'temperature', val);
  };

  return (
    <BaseNode id={id} title="LLM" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Model:
        <select value={model} onChange={handleModelChange} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="gpt-4o">gpt-4o</option>
          <option value="claude-3.5-sonnet">claude-3.5-sonnet</option>
          <option value="llama-3">llama-3</option>
        </select>
      </label>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Temperature:
        <input 
          type="number" 
          step="0.1" 
          min="0" 
          max="2" 
          value={temperature} 
          onChange={handleTempChange} 
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
