'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Cpu, CheckCircle2, AlertTriangle, PowerOff, TrendingUp, Wind } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { kpis } = useApp();

  const cards = [
    {
      title: "Total Towers",
      value: kpis.totalTowers,
      unit: "Nodes",
      subtext: "Smart Grid Mesh",
      icon: Cpu,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/20",
      glowColor: "group-hover:shadow-glow-cyan",
      bgGradient: "from-cyan-950/20 to-slate-900/40"
    },
    {
      title: "Active Towers",
      value: kpis.activeTowers,
      unit: "Online",
      subtext: "Active Filtration",
      icon: CheckCircle2,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      glowColor: "group-hover:shadow-glow-green",
      bgGradient: "from-emerald-950/20 to-slate-900/40"
    },
    {
      title: "Offline Towers",
      value: kpis.offlineTowers,
      unit: "Standby",
      subtext: "Telemetry Lost / Off",
      icon: PowerOff,
      color: "text-slate-400",
      borderColor: "border-slate-800",
      glowColor: "",
      bgGradient: "from-slate-900/40 to-slate-900/20"
    },
    {
      title: "Towers in Alert",
      value: kpis.alertTowers,
      unit: "Warnings",
      subtext: "Requires Attention",
      icon: AlertTriangle,
      color: kpis.alertTowers > 0 ? "text-amber-400" : "text-slate-400",
      borderColor: kpis.alertTowers > 0 ? "border-amber-500/30" : "border-slate-800",
      glowColor: kpis.alertTowers > 0 ? "group-hover:shadow-glow-amber" : "",
      bgGradient: kpis.alertTowers > 0 ? "from-amber-950/20 to-slate-900/40" : "from-slate-900/40 to-slate-900/20"
    },
    {
      title: "Avg Relative Improvement",
      value: `${kpis.avgRelativeImprovement}%`,
      unit: "Efficiency",
      subtext: "Gas Response Drop",
      icon: TrendingUp,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      glowColor: "group-hover:shadow-glow-green",
      bgGradient: "from-emerald-950/30 to-slate-900/50"
    },
    {
      title: "Total Air Processed",
      value: kpis.totalAirProcessed.toLocaleString(),
      unit: "m³",
      subtext: "Cumulative Volume",
      icon: Wind,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      glowColor: "group-hover:shadow-glow-cyan",
      bgGradient: "from-cyan-950/30 to-slate-900/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`group relative glass-panel p-4 rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.bgGradient} transition-all duration-300 hover:-translate-y-0.5 ${card.glowColor}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold font-mono text-white tracking-tight">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-slate-500">{card.unit}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 inline-block" />
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
