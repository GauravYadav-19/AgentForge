import { Handle } from 'reactflow';
import { Cpu, Database, MessageSquare, Terminal, Zap, Link, FileText, Settings, Shield, GitMerge } from 'lucide-react';

const getIcon = (title) => {
  switch (title) {
    case 'LLM': return <Cpu className="w-4 h-4 text-emerald-500" />;
    case 'Vector DB': return <Database className="w-4 h-4 text-emerald-500" />;
    case 'Prompt Template': return <MessageSquare className="w-4 h-4 text-emerald-500" />;
    case 'AI Agent': return <Zap className="w-4 h-4 text-emerald-500" />;
    case 'API Webhook': return <Link className="w-4 h-4 text-emerald-500" />;
    case 'Policy Enforcement Point': return <Shield className="w-4 h-4 text-emerald-500" />;
    case 'Semantic Router': return <GitMerge className="w-4 h-4 text-emerald-500" />;
    case 'Input':
    case 'Output': return <Settings className="w-4 h-4 text-zinc-400" />;
    case 'Text': return <FileText className="w-4 h-4 text-zinc-400" />;
    default: return <Terminal className="w-4 h-4 text-zinc-400" />;
  }
};

export const BaseNode = ({ id, title, handles, children, selected }) => {
  return (
    <div className={`w-64 rounded-xl border bg-zinc-950 p-4 shadow-xl transition-all ${selected ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2 text-sm font-semibold text-zinc-100">
        {getIcon(title)}
        <span>{title}</span>
      </div>
      
      <div className="flex flex-col gap-3">
        {children}
      </div>

      {handles && handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={h.position}
          id={h.id}
          className="!bg-zinc-950 !border-2 !border-emerald-500 !w-4 !h-4 hover:!bg-emerald-400 hover:!w-5 hover:!h-5 transition-all"
          style={h.style}
        />
      ))}
    </div>
  );
};
