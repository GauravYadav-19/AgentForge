import React, { useMemo } from 'react';
import { useStore } from './store';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export const PreFlightAuditWidget = () => {
    const nodes = useStore((state) => state.nodes);

    const { totalCost, riskLevel } = useMemo(() => {
        let cost = 0;
        nodes.forEach((node) => {
            if (node.type === 'llm') cost += 0.05;
            else if (node.type === 'vectorDb') cost += 0.02;
            else if (node.type === 'agent') cost += 0.10;
            else if (node.type === 'customInput' || node.type === 'customOutput') cost += 0.0015;
        });

        let risk = 'Low';
        if (cost > 0.05) risk = 'Medium';
        if (cost >= 0.1) risk = 'High';

        return { totalCost: cost, riskLevel: risk };
    }, [nodes]);

    const budget = 0.1; // Governance max_budget

    return (
        <div className="absolute top-4 left-4 z-40 w-72 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl p-4 flex flex-col gap-3 transition-all">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                <h3 className="text-zinc-200 font-bold text-sm tracking-wide">Enterprise Pre-Flight Audit</h3>
            </div>
            
            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Live Estimated Cost:</span>
                    <span className="text-zinc-300 font-bold">${totalCost.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-500">Governance Budget:</span>
                    <span className="text-zinc-300">${budget.toFixed(4)}</span>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Risk Level:</span>
                {riskLevel === 'Low' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Low Cost Path
                    </span>
                )}
                {riskLevel === 'Medium' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                        <Info className="w-3 h-3" /> Medium Risk
                    </span>
                )}
                {riskLevel === 'High' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> High Cost Path
                    </span>
                )}
            </div>
            
            {totalCost > budget && (
                <div className="mt-1 text-[10px] text-red-400 font-mono text-center">
                    ⚠️ Exceeds Governance Budget. Will be blocked.
                </div>
            )}
        </div>
    );
};
