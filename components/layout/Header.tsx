'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Play, Radio, Bell, User, Zap } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import Link from 'next/link';

export const Header: React.FC = () => {
  const { kpis, isSimulationActive, toggleSimulation, startLiveDemo, alerts } = useApp();
  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlertCount = alerts.filter(a => a.status === 'active').length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-[#080c14]/90 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-0.5 shadow-glow-green group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-wider text-white">AIRSHEILD</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Smart Pollution Reduction Grid</p>
            </div>
          </Link>
        </div>

        {/* Center System Status & Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${kpis.alertTowers > 0 ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
            <span className="text-xs font-medium text-slate-300">
              {kpis.alertTowers > 0 ? `${kpis.alertTowers} Grid Warning(s)` : 'Grid Fully Operational'}
            </span>
          </div>

          {/* Live Clock */}
          <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 rounded-lg bg-slate-900/40 border border-slate-800/60">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-200">{timeString || '15:53:39'}</span>
            <span className="text-slate-500">|</span>
            <span>{dateString}</span>
          </div>

          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              isSimulationActive
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle realistic live sensor update ticks"
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulationActive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>Simulation: {isSimulationActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right CTA & User Area */}
        <div className="flex items-center gap-3">
          {/* START LIVE DEMO BUTTON */}
          <button
            onClick={() => startLiveDemo()}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 shadow-glow-green hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START LIVE DEMO</span>
          </button>

          {/* Notifications Icon */}
          <Link href="/alerts" className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors">
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-glow-red">
                {activeAlertCount}
              </span>
            )}
          </Link>

          {/* User Profile Area */}
          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-xs font-medium text-slate-200">Grid Admin</p>
              <p className="text-[10px] text-slate-400">ESP32 Telemetry Node</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
