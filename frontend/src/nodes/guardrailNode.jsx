import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const GuardrailNode = ({ id, data, selected }) => {
  const [schema, setSchema] = useState(data?.schema || '{}');
  const [latency, setLatency] = useState(data?.latency || 200);
  const [policy, setPolicy] = useState(data?.policy || 'Strict');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-in` },
    { type: 'source', position: Position.Right, id: `${id}-out` }
  ];

  const handleSchemaChange = (e) => {
    const val = e.target.value;
    setSchema(val);
    updateNodeField(id, 'schema', val);
  };

  const handleLatencyChange = (e) => {
    const val = parseInt(e.target.value);
    setLatency(val);
    updateNodeField(id, 'latency', val);
  };

  const handlePolicyChange = (e) => {
    const val = e.target.value;
    setPolicy(val);
    updateNodeField(id, 'policy', val);
  };

  return (
    <BaseNode id={id} title="Policy Enforcement Point" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-emerald-500 font-bold tracking-wide gap-1">
        Target JSON Schema:
        <textarea 
          rows={3}
          value={schema} 
          onChange={handleSchemaChange} 
          className="w-full rounded-md border border-emerald-900 bg-zinc-900 px-2 py-1 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder='{"type": "object"}'
        />
      </label>
      
      <label className="flex flex-col text-xs text-zinc-400 gap-1 mt-1">
        Max Latency Threshold (ms):
        <input 
          type="number" 
          value={latency} 
          onChange={handleLatencyChange} 
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>

      <label className="flex flex-col text-xs text-zinc-400 gap-1 mt-1">
        Content Policy:
        <select value={policy} onChange={handlePolicyChange} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="Strict">Strict</option>
          <option value="Moderate">Moderate</option>
          <option value="Lenient">Lenient</option>
        </select>
      </label>
    </BaseNode>
  );
}
