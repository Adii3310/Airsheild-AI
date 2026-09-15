'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Zap, Sun, Battery, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function EnergyPage() {
  const { towers } = useApp();

  const totalCurrentPower = towers.reduce((acc, t) => acc + t.powerConsumption, 0);
  const avgBattery = Math.round(towers.reduce((acc, t) => acc + t.batteryLevel, 0) / (towers.length || 1));
  const solarGenEstimate = 420; // Watts
  const dailyEnergyKwh = Number((totalCurrentPower * 24 / 1000).toFixed(1));
  const gridEfficiency = 94.2;

  const energyTimeSeries = [
    { time: '00:00', power: 340, solar: 0, battery: 92 },
    { time: '04:00', power: 290, solar: 0, battery: 85 },
    { time: '08:00', power: 480, solar: 220, battery: 88 },
    { time: '12:00', power: 580, solar: 510, battery: 98 },
    { time: '16:00', power: 520, solar: 390, battery: 100 },
    { time: '20:00', power: 450, solar: 40, battery: 94 },
    { time: '24:00', power: 380, solar: 0, battery: 90 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">Power & Solar Energy Command</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Microcontroller energy profiling & INA219 current sensor telemetry across the filtration mesh.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>INA219 Ready</span>
        </span>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">Current Power Draw</span>
          <p className="text-xl font-extrabold font-mono text-amber-400">{totalCurrentPower} W</p>
          <span className="text-[10px] text-slate-500">Live Grid Total</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">Daily Consumption</span>
          <p className="text-xl font-extrabold font-mono text-white">{dailyEnergyKwh} kWh</p>
          <span className="text-[10px] text-slate-500">Estimated 24h</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">Solar Generation</span>
          <p className="text-xl font-extrabold font-mono text-emerald-400">{solarGenEstimate} W</p>
          <span className="text-[10px] text-slate-500">PV Solar Input</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">Average Battery Level</span>
          <p className="text-xl font-extrabold font-mono text-emerald-400">{avgBattery}%</p>
          <span className="text-[10px] text-slate-500">LiFePO4 Array</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">Grid Power Offset</span>
          <p className="text-xl font-extrabold font-mono text-cyan-400">{(totalCurrentPower - solarGenEstimate > 0 ? totalCurrentPower - solarGenEstimate : 0)} W</p>
          <span className="text-[10px] text-slate-500">Supplemental Mains</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
          <span className="text-[11px] text-slate-400">System Power Efficiency</span>
          <p className="text-xl font-extrabold font-mono text-purple-400">{gridEfficiency}%</p>
          <span className="text-[10px] text-slate-500">Converter Efficiency</span>
        </div>
      </div>

      {/* Energy Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Power vs Solar */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Power Draw vs Solar Generation</h3>
            <span className="text-[10px] font-mono text-slate-500">24-Hour Profile</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyTimeSeries}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="power" name="Power Consumption (W)" stroke="#f59e0b" fill="transparent" strokeWidth={2.5} />
                <Area type="monotone" dataKey="solar" name="Solar Generation (W)" stroke="#10b981" fill="url(#solarGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Battery Charge Curve */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Grid Battery Storage Trajectory</h3>
            <span className="text-[10px] font-mono text-slate-500">State of Charge (%)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyTimeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="battery" name="Battery Level (%)" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
