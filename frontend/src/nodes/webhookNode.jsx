// webhookNode.jsx
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const WebhookNode = ({ id, data, selected }) => {
  const [method, setMethod] = useState(data?.method || 'POST');
  const [url, setUrl] = useState(data?.url || 'https://');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'source', position: Position.Right, id: `${id}-payload` }
  ];

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    updateNodeField(id, 'url', e.target.value);
  };

  return (
    <BaseNode id={id} title="API Webhook" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Method:
        <select value={method} onChange={handleMethodChange} className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </label>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        URL:
        <input 
          type="text" 
          value={url} 
          onChange={handleUrlChange} 
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
