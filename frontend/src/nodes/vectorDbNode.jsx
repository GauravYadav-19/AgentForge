// vectorDbNode.jsx
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const VectorDbNode = ({ id, data, selected }) => {
  const [provider, setProvider] = useState(data?.provider || 'Pinecone');
  const [indexName, setIndexName] = useState(data?.indexName || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-document`, style: { top: `${100/3}%` } },
    { type: 'target', position: Position.Left, id: `${id}-query`, style: { top: `${200/3}%` } },
    { type: 'source', position: Position.Right, id: `${id}-results` }
  ];

  const handleProviderChange = (e) => {
    setProvider(e.target.value);
    updateNodeField(id, 'provider', e.target.value);
  };

  const handleIndexNameChange = (e) => {
    setIndexName(e.target.value);
    updateNodeField(id, 'indexName', e.target.value);
  };

  return (
    <BaseNode id={id} title="Vector DB" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Provider:
        <select value={provider} onChange={handleProviderChange} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="Pinecone">Pinecone</option>
          <option value="Chroma">Chroma</option>
          <option value="Milvus">Milvus</option>
        </select>
      </label>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Index Name:
        <input 
          type="text" 
          value={indexName} 
          onChange={handleIndexNameChange} 
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
