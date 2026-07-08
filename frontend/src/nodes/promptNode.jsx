// promptNode.jsx
import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const PromptNode = ({ id, data, selected }) => {
  const [template, setTemplate] = useState(data?.template || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-variables` },
    { type: 'source', position: Position.Right, id: `${id}-output` }
  ];

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
    updateNodeField(id, 'template', e.target.value);
  };

  return (
    <BaseNode id={id} title="Prompt Template" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Template:
        <textarea 
          value={template} 
          onChange={handleTemplateChange} 
          rows="3"
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
