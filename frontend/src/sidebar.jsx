import React, { useState } from 'react';
import { 
  MessageSquare, ArrowRight, Type, 
  Cpu, FileText, Bot, 
  Database, Webhook, ChevronLeft, ChevronRight, Shield, GitMerge
} from 'lucide-react';

const SidebarItem = ({ item, onDragStart }) => {
    const [hintPos, setHintPos] = useState(null);

    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHintPos({ top: rect.top + rect.height / 2, left: rect.right + 12 });
        setTimeout(() => setHintPos(null), 2500);
    };

    const handleDragStart = (event) => {
        setHintPos(null);
        onDragStart(event, item.type);
    };

    return (
        <>
            <div
                className="group cursor-grab mb-2 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-sm font-medium text-zinc-300 transition-all hover:border-emerald-500 hover:bg-zinc-900 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] active:bg-zinc-800"
                onDragStart={handleDragStart}
                onDragEnd={(event) => (event.target.style.cursor = 'grab')}
                onClick={handleClick}
                draggable
            >
                <div className="flex items-center gap-3">
                    <div className="text-zinc-500 transition-colors group-hover:text-emerald-400">{item.icon}</div>
                    <span>{item.label}</span>
                </div>
            </div>
            
            {hintPos && (
                <div 
                    className="fixed z-[100] animate-pulse whitespace-nowrap rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xl flex items-center gap-1.5"
                    style={{ top: hintPos.top, left: hintPos.left, transform: 'translateY(-50%)' }}
                >
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-r-[6px] border-y-transparent border-r-emerald-600"></div>
                    👆 Hold and drag me!
                </div>
            )}
        </>
    );
};

export const Sidebar = ({ isOpen, setIsOpen }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const categories = [
        {
            name: "Core",
            items: [
                { type: 'customInput', label: 'Input', icon: <ArrowRight className="w-4 h-4" /> },
                { type: 'customOutput', label: 'Output', icon: <MessageSquare className="w-4 h-4" /> },
                { type: 'text', label: 'Text', icon: <Type className="w-4 h-4" /> }
            ]
        },
        {
            name: "Logic",
            items: [
                { type: 'llm', label: 'LLM', icon: <Cpu className="w-4 h-4" /> },
                { type: 'prompt', label: 'Prompt Template', icon: <FileText className="w-4 h-4" /> },
                { type: 'agent', label: 'AI Agent', icon: <Bot className="w-4 h-4" /> },
                { type: 'router', label: 'Semantic Router', icon: <GitMerge className="w-4 h-4" /> }
            ]
        },
        {
            name: "Integrations",
            items: [
                { type: 'vectorDb', label: 'Vector DB', icon: <Database className="w-4 h-4" /> },
                { type: 'webhook', label: 'API Webhook', icon: <Webhook className="w-4 h-4" /> }
            ]
        },
        {
            name: "Governance",
            items: [
                { type: 'guardrail', label: 'Policy Enforcement', icon: <Shield className="w-4 h-4" /> }
            ]
        }
    ];

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-4 z-50 flex items-center justify-center w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 transition-all shadow-lg duration-300 ${isOpen ? 'left-[17rem]' : 'left-4'}`}
            >
                {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            <div className={`relative flex flex-col h-full border-r border-zinc-800 bg-zinc-950 overflow-y-auto z-40 transition-all duration-300 shrink-0 ${isOpen ? 'w-72 p-5' : 'w-0 p-0 overflow-hidden border-r-0'}`}>
                <div className="text-xl font-bold text-zinc-100 mb-8 tracking-tight whitespace-nowrap">
                    AgentForge
                </div>

                {categories.map((category) => (
                    <div key={category.name} className="whitespace-nowrap">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 mt-6">
                        {category.name}
                    </div>
                    {category.items.map((item) => (
                        <SidebarItem key={item.type} item={item} onDragStart={onDragStart} />
                    ))}
                </div>
            ))}
            </div>
        </>
    );
};
