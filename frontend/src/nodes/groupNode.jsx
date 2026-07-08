import React from 'react';

export const GroupNode = ({ id, selected }) => {
  return (
    <div className={`w-full h-full min-w-[200px] min-h-[200px] rounded-xl border-2 border-dashed transition-colors ${selected ? 'border-emerald-500 bg-zinc-900/40' : 'border-zinc-700 bg-zinc-900/20'}`}>
      <div className="px-3 py-1 bg-zinc-800 text-xs font-bold text-zinc-300 rounded-br-lg rounded-tl-lg uppercase tracking-widest inline-block">
        Sub-Flow
      </div>
    </div>
  );
};
