'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { AirflowDiagram } from '@/components/towers/AirflowDiagram';
import { LiveSensorGraph } from '@/components/towers/LiveSensorGraph';
import { ArrowLeft, Play, Cpu, Fan, Thermometer, Droplets, ShieldCheck, Zap, Battery, Activity, Info } from 'lucide-react';
import Link from 'next/link';

export default function TowerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { towers, startLiveDemo } = useApp();

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const tower = towers.find(t => t.id.toLowerCase() === id?.toLowerCase());

  if (!tower) {
    return (
      <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-4 max-w-lg mx-auto mt-12">
        <Cpu className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Tower Node Not Found</h2>
        <p className="text-sm text-slate-400">No ESP32 telemetry node registered under ID "{id}".</p>
        <button
          onClick={() => router.push('/towers')}
          className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-semibold text-xs border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
        >
          Return to Towers List
        </button>
      </div>
    );
  }

  const metricCards = [
    { label: "MQ135 #1 (Intake Gas Response)", value: `${tower.pollutionBefore} units`, sub: "Raw Unfiltered Air", color: tower.pollutionBefore > 600 ? "text-red-400" : "text-amber-400" },
    { label: "MQ135 #2 (Outlet Gas Response)", value: `${tower.pollutionAfter} units`, sub: "Filtered Clean Output", color: "text-cyan-400" },
    { label: "Relative Improvement", value: `+${tower.efficiency}%`, sub: "Relative Reduction", color: "text-emerald-400" },
    { label: "Blower Fan Speed", value: `${tower.fanSpeed}%`, sub: "PWM Speed Throttle", color: "text-cyan-400" },
    { label: "Ambient Temperature", value: `${tower.temperature}°C`, sub: "Thermal Profile", color: "text-amber-400" },
    { label: "Relative Humidity", value: `${tower.humidity}%`, sub: "RH Moisture Level", color: "text-blue-400" },
    { label: "MERV-13 Filter Health", value: `${tower.filterHealth}%`, sub: "Particulate Filter Lifespan", color: tower.filterHealth < 30 ? "text-red-400" : "text-emerald-400" },
    { label: "Activated Carbon Health", value: `${tower.carbonFilterHealth}%`, sub: "VOC Adsorption Lifespan", color: tower.carbonFilterHealth < 30 ? "text-red-400" : "text-emerald-400" },
    { label: "Power Consumption", value: `${tower.powerConsumption} W`, sub: "INA219 Voltage Rail", color: "text-amber-400" },
    { label: "Solar Battery Level", value: `${tower.batteryLevel}%`, sub: "Backup Battery Charge", color: "text-emerald-400" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/towers')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{tower.name}</h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{tower.id}</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                tower.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                tower.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                tower.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                'bg-slate-800 text-slate-400'
              }`}>
                {tower.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{tower.locationName} • Last updated: {tower.lastUpdated}</p>
          </div>
        </div>

        {/* Action Button: START LIVE DEMO FOR THIS TOWER */}
        <button
          onClick={() => startLiveDemo(tower.id)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-glow-green hover:scale-[1.02] transition-all"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>START DEMO ON THIS TOWER</span>
        </button>
      </div>

      {/* 10 Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metricCards.map((card, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
            <span className="text-[11px] text-slate-400">{card.label}</span>
            <div className={`text-xl font-extrabold font-mono ${card.color}`}>
              {card.value}
            </div>
            <p className="text-[10px] text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Live Airflow Diagram */}
      <AirflowDiagram tower={tower} />

      {/* Live Sensor Recharts Graph */}
      <LiveSensorGraph tower={tower} />

      {/* Technical Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">Engineering & Sensor Calibration Notice</p>
          <p className="text-slate-400 leading-relaxed">
            The MQ135 gas sensor provides relative voltage response for general airborne contaminants and VOCs. Direct, high-precision CO₂ quantification requires an NDIR sensor (such as SCD40/SCD41 or MH-Z19B). Current telemetry uses dual MQ135 differential analysis to compute relative filtration performance.
          </p>
        </div>
      </div>
    </div>
  );
}
