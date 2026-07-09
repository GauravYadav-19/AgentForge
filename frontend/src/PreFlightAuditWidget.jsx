import React, { useMemo, useState } from 'react';
import { useStore } from './store';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const PreFlightAuditWidget = () => {
    const nodes = useStore((state) => state.nodes);

    const { totalCost } = useMemo(() => {
        let cost = 0;
        nodes.forEach((node) => {
            if (node.type === 'llm') cost += 0.05;
            else if (node.type === 'vectorDb') cost += 0.02;
            else if (node.type === 'agent') cost += 0.10;
            else if (node.type === 'customInput' || node.type === 'customOutput') cost += 0.0015;
        });

        return { totalCost: cost };
    }, [nodes]);

    const budget = useStore((state) => state.budget);
    const setBudget = useStore((state) => state.setBudget);

    const maxBudget = parseFloat(budget) || 1; // Prevent division by zero
    const usageRatio = totalCost / maxBudget;
    
    let risk = { label: "Low Risk", textColor: "text-emerald-500", bgColor: "bg-emerald-500/10", Icon: CheckCircle, pulse: false };
    
    if (usageRatio > 1.0) {
        risk = { label: "Budget Exceeded", textColor: "text-red-500", bgColor: "bg-red-500/10", Icon: AlertTriangle, pulse: true };
    } else if (usageRatio > 0.8) {
        risk = { label: "High Risk", textColor: "text-orange-500", bgColor: "bg-orange-500/10", Icon: AlertTriangle, pulse: false };
    } else if (usageRatio > 0.5) {
        risk = { label: "Medium Risk", textColor: "text-yellow-500", bgColor: "bg-yellow-500/10", Icon: Info, pulse: false };
    }

    return (
        <div className="absolute top-4 left-4 z-40 w-72 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-4 flex flex-col gap-3 transition-all">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3 className="text-zinc-200 font-bold text-sm tracking-wide">Governance & Audit</h3>
            </div>
            
            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-500">Live Estimated Cost:</span>
                    <span className="text-zinc-300 font-bold">$     {totalCost.toFixed(4)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-500">Governance Budget:</span>
                    <span className="text-zinc-300 flex items-center">
                        $
                        <input 
                            type="number" 
                            step="0.01" 
                            value={budget} 
                            onChange={(e) => setBudget(e.target.value)} 
                            onFocus={(e) => { if (e.target.value === "1.0" || e.target.value === "0") setBudget(""); }}
                            onBlur={(e) => { if (e.target.value === "" || isNaN(parseFloat(e.target.value))) setBudget("1.0"); }}
                            className="w-14 bg-transparent outline-none border-none text-right font-mono focus:text-emerald-400 p-0 m-0 leading-none"
                        />
                    </span>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Risk Level:</span>
                <span className={`flex items-center gap-1 text-xs font-bold ${risk.textColor} ${risk.bgColor} px-2 py-1 rounded ${risk.pulse ? 'animate-pulse' : ''}`}>
                    <risk.Icon className="w-3 h-3" /> {risk.label}
                </span>
            </div>
            
            {usageRatio > 1.0 && (
                <div className="mt-1 text-[10px] text-red-400 font-mono text-center">
                    ⚠️ Exceeds Governance Budget. Will be blocked.
                </div>
            )}
        </div>
    );
};
