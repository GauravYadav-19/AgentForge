import { useState } from 'react';

export const DraggableNode = ({ type, label }) => {
    const [showHint, setShowHint] = useState(false);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
      setShowHint(false);
    };

    const handleClick = () => {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 2500);
    };
  
    return (
      <div className="relative">
        <div
          className={`cursor-grab rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400 active:bg-zinc-800 ${type}`}
          onDragStart={(event) => onDragStart(event, type)}
          onDragEnd={(event) => (event.target.style.cursor = 'grab')}
          onClick={handleClick}
          draggable
        >
            <span>{label}</span>
        </div>
        
        {/* Helper Tooltip on Click */}
        {showHint && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 animate-pulse whitespace-nowrap rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xl flex items-center gap-1.5">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-r-[6px] border-y-transparent border-r-emerald-600"></div>
                👆 Hold and drag me onto the canvas!
            </div>
        )}
      </div>
    );
};