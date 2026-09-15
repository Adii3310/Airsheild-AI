'use client';

import React from 'react';
import { Cpu, Wifi, Cloud, LayoutDashboard, BrainCircuit, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export const SmartGridDiagram: React.FC = () => {
  const steps = [
    {
      id: "1",
      name: "ESP32 Towers",
      subtitle: "Physical Nodes",
      detail: "MQ135 #1 & #2, MERV-13, Carbon Filter & INA219 Sensors",
      icon: Cpu,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      glow: "shadow-glow-green/20"
    },
    {
      id: "2",
      name: "Wi-Fi Telemetry",
      subtitle: "IoT Pipeline",
      detail: "HTTP / MQTT JSON Payload transmission every 3s",
      icon: Wifi,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/40",
      glow: "shadow-glow-cyan/20"
    },
    {
      id: "3",
      name: "Cloud / Firebase",
      subtitle: "Data Ingestion",
      detail: "Real-time NoSQL DB & Telemetry Event Stream",
      icon: Cloud,
      color: "text-blue-400",
      borderColor: "border-blue-500/40",
      glow: ""
    },
    {
      id: "4",
      name: "Airsheild AI Dashboard",
      subtitle: "Grid Command",
      detail: "Live Map, Alerts, Airflow Monitoring & Control Center",
      icon: LayoutDashboard,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/40",
      glow: "shadow-glow-green/30"
    },
    {
      id: "5",
      name: "AI Engine",
      subtitle: "Decision Support",
      detail: "Historical response forecasting & fan speed optimization",
      icon: BrainCircuit,
      color: "text-purple-400",
      borderColor: "border-purple-500/40",
      glow: ""
    },
    {
      id: "6",
      name: "Smart Decisions",
      subtitle: "Automated Control",
      detail: "Dynamic PWM Blower adjustment & alert dispatch",
      icon: Zap,
      color: "text-amber-400",
      borderColor: "border-amber-500/40",
      glow: "shadow-glow-amber/20"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">Smart Pollution Reduction Grid Architecture</h3>
          <p className="text-xs text-slate-400">End-to-End ESP32 Telemetry & Real-Time Firebase Cloud Data Flow Pipeline</p>
        </div>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          Firebase Ready
        </span>
      </div>

      {/* Network Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              <div
                className={`w-full p-4 rounded-xl glass-panel border ${step.borderColor} bg-slate-900/80 flex flex-col items-center text-center space-y-2 hover:scale-[1.03] transition-transform ${step.glow}`}
              >
                <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step 0{step.id}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">{step.name}</h4>
                  <p className="text-[11px] font-medium text-emerald-400">{step.subtitle}</p>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight pt-1 border-t border-slate-800/80">
                  {step.detail}
                </p>
              </div>

              {/* Arrow Connector for larger screens */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-4 h-4 text-emerald-500 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Abstraction Layer Active: Switch from MockDataService to FirebaseDataService with zero UI rewrites.</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">ESP32-S3 → Wi-Fi → Cloud</span>
      </div>
    </div>
  );
};
