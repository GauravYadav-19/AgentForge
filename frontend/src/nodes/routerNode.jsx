import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const RouterNode = ({ id, data, selected }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handles = [
    { type: 'target', position: Position.Left, id: `${id}-input`, style: { top: '50%' } },
    { type: 'source', position: Position.Right, id: `${id}-path-true`, style: { top: '30%' } },
    { type: 'source', position: Position.Right, id: `${id}-path-false`, style: { top: '70%' } }
  ];

  const handleConditionChange = (e) => {
    const val = e.target.value;
    setCondition(val);
    updateNodeField(id, 'condition', val);
  };

  return (
    <BaseNode id={id} title="Semantic Router" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Condition (Regex / Keyword):
        <input 
          type="text" 
          value={condition} 
          onChange={handleConditionChange} 
          placeholder="e.g., error|fail"
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>

      {/* Absolute positioned labels for the True/False branches */}
      <div className="absolute right-[-10px] top-[30%] -translate-y-1/2 translate-x-full text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded pointer-events-none">
        True
      </div>
      <div className="absolute right-[-10px] top-[70%] -translate-y-1/2 translate-x-full text-[10px] font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded pointer-events-none">
        False
      </div>
    </BaseNode>
  );
};
