'use client';

import React from 'react';
import { Tower } from '@/lib/types';
import { Wind, Cpu, Fan, Filter, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface AirflowDiagramProps {
  tower: Tower;
}

export const AirflowDiagram: React.FC<AirflowDiagramProps> = ({ tower }) => {
  const steps = [
    {
      id: "1",
      name: "POLLUTED AIR",
      type: "Ambient Intake",
      metric: `Gas Response: ${tower.pollutionBefore} units`,
      metricColor: tower.pollutionBefore > 600 ? "text-red-400" : "text-amber-400",
      icon: Wind,
      borderColor: "border-red-500/40",
      bgGradient: "from-red-950/20 to-slate-900/40"
    },
    {
      id: "2",
      name: "MQ135 SENSOR #1",
      type: "Intake Telemetry",
      metric: "Raw Pollution Level",
      metricColor: "text-slate-300",
      icon: Cpu,
      borderColor: "border-amber-500/40",
      bgGradient: "from-amber-950/20 to-slate-900/40"
    },
    {
      id: "3",
      name: "INTAKE BLOWER",
      type: "PWM Fan Throttling",
      metric: `${tower.fanSpeed}% Speed`,
      metricColor: "text-cyan-400",
      icon: Fan,
      animate: tower.fanSpeed > 0,
      borderColor: "border-cyan-500/40",
      bgGradient: "from-cyan-950/20 to-slate-900/40"
    },
    {
      id: "4",
      name: "MERV-13 FILTER",
      type: "Particulate Interception",
      metric: `Health: ${tower.filterHealth}%`,
      metricColor: tower.filterHealth < 30 ? "text-red-400" : "text-emerald-400",
      icon: Filter,
      borderColor: "border-emerald-500/40",
      bgGradient: "from-emerald-950/20 to-slate-900/40"
    },
    {
      id: "5",
      name: "ACTIVATED CARBON",
      type: "VOC & Gas Adsorption",
      metric: `Health: ${tower.carbonFilterHealth}%`,
      metricColor: tower.carbonFilterHealth < 30 ? "text-red-400" : "text-emerald-400",
      icon: Filter,
      borderColor: "border-emerald-500/40",
      bgGradient: "from-emerald-950/20 to-slate-900/40"
    },
    {
      id: "6",
      name: "OUTLET BLOWER",
      type: "Clean Air Exhaust",
      metric: `${tower.fanSpeed}% Speed`,
      metricColor: "text-cyan-400",
      icon: Fan,
      animate: tower.fanSpeed > 0,
      borderColor: "border-cyan-500/40",
      bgGradient: "from-cyan-950/20 to-slate-900/40"
    },
    {
      id: "7",
      name: "MQ135 SENSOR #2",
      type: "Outlet Telemetry",
      metric: `Gas Response: ${tower.pollutionAfter} units`,
      metricColor: "text-cyan-400",
      icon: Cpu,
      borderColor: "border-cyan-500/40",
      bgGradient: "from-cyan-950/20 to-slate-900/40"
    },
    {
      id: "8",
      name: "IMPROVED AIR",
      type: "Filtered Output",
      metric: `+${tower.efficiency}% Relative Drop`,
      metricColor: "text-emerald-400",
      icon: Sparkles,
      borderColor: "border-emerald-500/60",
      bgGradient: "from-emerald-950/40 to-slate-900/60",
      glow: "shadow-glow-green"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Live Filtration Airflow Matrix</h3>
          <p className="text-xs text-slate-400">Sequential ESP32 Dual-Sensor Telemetry & Multi-Stage Physical Filtration Pipeline</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active Filtration Matrix</span>
        </div>
      </div>

      {/* Horizontal / Grid Flow */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-2 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              <div className={`w-full h-full p-3.5 rounded-xl glass-panel border ${step.borderColor} bg-gradient-to-b ${step.bgGradient} flex flex-col items-center text-center space-y-2 hover:scale-[1.03] transition-transform ${step.glow || ''}`}>
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <Icon className={`w-5 h-5 ${step.animate ? 'animate-spin' : ''} text-emerald-400`} style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Stage 0{step.id}</span>
                  <h4 className="text-xs font-extrabold text-white mt-0.5 leading-tight">{step.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{step.type}</p>
                </div>
                <div className="mt-auto pt-2 w-full border-t border-slate-800/80">
                  <span className={`text-[10px] font-bold font-mono ${step.metricColor}`}>{step.metric}</span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300">
        <span>
          <strong className="text-emerald-400">Filtration Performance:</strong> Relative gas response drops from <strong className="text-amber-400">{tower.pollutionBefore} units</strong> to <strong className="text-cyan-400">{tower.pollutionAfter} units</strong>.
        </span>
        <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/40">
          +{tower.efficiency}% Relative Improvement
        </span>
      </div>
    </div>
  );
};
