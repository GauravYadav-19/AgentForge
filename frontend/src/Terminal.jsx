import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Terminal = ({ logs, isOpen, onToggle }) => {
    const endOfLogsRef = useRef(null);
    const [height, setHeight] = useState(250);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (endOfLogsRef.current) {
            endOfLogsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
                setHeight(newHeight);
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="relative shrink-0 z-40">
            <button 
                onClick={onToggle}
                className="absolute right-4 flex items-center justify-center w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 transition-all shadow-lg z-50"
                style={{ top: '-48px' }}
            >
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
            <div 
                style={{ height: isOpen ? `${height}px` : '0px' }}
                className="w-full bg-zinc-950 border-t border-zinc-800 font-mono text-xs shadow-2xl flex flex-col relative transition-[height] duration-300 overflow-hidden"
            >
                {isOpen && (
                    <div 
                        className="absolute top-0 left-0 right-0 h-1.5 cursor-row-resize hover:bg-emerald-500 transition-colors z-50"
                        onMouseDown={handleMouseDown}
                    />
                )}
                
                <div className="p-4 flex-1 overflow-auto flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-2 shrink-0">
                    <div className="text-zinc-300 font-bold tracking-widest uppercase">
                        &gt;_ System Execution Log (Telemetry)
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    {logs.map((log, index) => {
                        let levelColor = 'text-zinc-400';
                        if (log.level === 'SUCCESS' || log.level === 'INTENT') levelColor = 'text-emerald-500';
                        if (log.level === 'ERROR') levelColor = 'text-red-500';
                        if (log.level === 'WARNING') levelColor = 'text-amber-500';
                        if (log.level === 'AUDIT' || log.level === 'DAG') levelColor = 'text-cyan-500';
                        if (log.level === 'GOVERNANCE') levelColor = 'text-purple-500';

                        return (
                            <div key={index} className="flex gap-3 font-mono text-zinc-300">
                                <span className="text-zinc-600 shrink-0">{log.timestamp}</span>
                                <span className={`${levelColor} font-bold w-24 shrink-0`}>[{log.level}]</span>
                                <span className="text-zinc-500 shrink-0">({log.component})</span>
                                <span>{log.message}</span>
                            </div>
                        );
                    })}
                    <div ref={endOfLogsRef} />
                </div>
            </div>
            </div>
        </div>
    );
};
