'use client';

import React from 'react';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { SmartGridDiagram } from '@/components/dashboard/SmartGridDiagram';
import { TowerMap } from '@/components/maps/TowerMap';
import { TowerTable } from '@/components/towers/TowerTable';
import { useApp } from '@/lib/context/AppContext';
import { Play, ShieldAlert, Sparkles, ArrowRight, Activity, Bell } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { towers, alerts, startLiveDemo } = useApp();
  const activeAlerts = alerts.filter(a => a.status === 'active').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero CTA */}
      <div className="relative p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 overflow-hidden shadow-glow-green/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Prototype Engine Ready
              </span>
              <span className="text-xs font-mono text-slate-400">• Hardware-Free Live Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Airsheild AI Command Center
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Monitoring physical ESP32-S3 filtration towers equipped with MQ135 dual-sensor telemetry, MERV-13 particulate filtration, and activated carbon VOC adsorption matrix.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => startLiveDemo()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-glow-green hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START LIVE DEMO</span>
            </button>
            <Link
              href="/map"
              className="w-full sm:w-auto px-5 py-3 rounded-xl glass-panel bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <span>Explore Live Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Top KPI Cards */}
      <KpiCards />

      {/* Grid Architecture Diagram */}
      <SmartGridDiagram />

      {/* Live Map Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">Live Grid Spatial Map</h2>
          <Link href="/map" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <TowerMap />
      </div>

      {/* Alerts Feed & Towers Table Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Alerts Sidebar */}
        <div className="lg:col-span-1 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Active Grid Alerts</h3>
            </div>
            <Link href="/alerts" className="text-[11px] font-semibold text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {activeAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active alerts at present.</p>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    alert.severity === 'critical' ? 'bg-red-950/30 border-red-500/40 text-red-300' :
                    alert.severity === 'high' ? 'bg-amber-950/30 border-amber-500/40 text-amber-300' :
                    'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] uppercase tracking-wider">{alert.towerId}</span>
                    <span className="text-[9px] opacity-75">{alert.timestamp}</span>
                  </div>
                  <p className="font-medium text-slate-200 leading-snug">{alert.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Towers Management Overview */}
        <div className="lg:col-span-3">
          <TowerTable towers={towers} />
        </div>
      </div>
    </div>
  );
}
