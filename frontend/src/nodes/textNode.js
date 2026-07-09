// textNode.js

import { useState, useRef, useEffect } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);

  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
    const matches = [...text.matchAll(regex)];
    const uniqueVars = [...new Set(matches.map(match => match[1]))];
    setVariables(uniqueVars);
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    extractVariables(currText);
    adjustHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tell React Flow to update its internal representation whenever dynamic variables change
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables, id, updateNodeInternals]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    extractVariables(newText);
    adjustHeight();
    updateNodeField(id, 'text', newText);
  };

  const calculateTop = (index, total) => {
    if (total === 1) return '50%';
    return `${20 + (60 / (total - 1)) * index}%`;
  };

  const handles = [
    ...variables.map((varName, index) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-target-${varName}`, // Strict unique ID construction
      style: { top: calculateTop(index, variables.length) }
    })),
    { type: 'source', position: Position.Right, id: `${id}-output` }
  ];

  return (
    <BaseNode id={id} title="Text" handles={handles} selected={selected}>
      <label className="flex flex-col text-xs text-zinc-400 gap-1">
        Text:
        <textarea 
          ref={textareaRef}
          value={currText} 
          onChange={handleTextChange} 
          style={{ minHeight: '100px', resize: 'vertical' }}
          className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </label>
    </BaseNode>
  );
}
