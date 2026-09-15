'use client';

import React, { useState } from 'react';
import { Tower } from '@/lib/types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { Activity, Thermometer, Droplets, Fan, ShieldCheck } from 'lucide-react';

interface LiveSensorGraphProps {
  tower: Tower;
}

export const LiveSensorGraph: React.FC<LiveSensorGraphProps> = ({ tower }) => {
  const [activeTab, setActiveTab] = useState<'pollution' | 'environment' | 'fan' | 'filter'>('pollution');

  // Generate realistic historical time series graph for this tower
  const mockSeries = [
    { time: '10 mins ago', before: Math.round(tower.pollutionBefore * 0.95), after: Math.round(tower.pollutionAfter * 0.96), temp: tower.temperature - 0.4, hum: tower.humidity + 1, fan: Math.max(0, tower.fanSpeed - 5), filter: tower.filterHealth + 1 },
    { time: '8 mins ago', before: Math.round(tower.pollutionBefore * 0.98), after: Math.round(tower.pollutionAfter * 0.98), temp: tower.temperature - 0.2, hum: tower.humidity, fan: tower.fanSpeed, filter: tower.filterHealth },
    { time: '6 mins ago', before: Math.round(tower.pollutionBefore * 1.02), after: Math.round(tower.pollutionAfter * 1.01), temp: tower.temperature, hum: tower.humidity - 1, fan: tower.fanSpeed, filter: tower.filterHealth },
    { time: '4 mins ago', before: Math.round(tower.pollutionBefore * 1.05), after: Math.round(tower.pollutionAfter * 1.03), temp: tower.temperature + 0.1, hum: tower.humidity - 2, fan: Math.min(100, tower.fanSpeed + 5), filter: tower.filterHealth },
    { time: '2 mins ago', before: Math.round(tower.pollutionBefore * 1.01), after: Math.round(tower.pollutionAfter * 1.01), temp: tower.temperature + 0.2, hum: tower.humidity - 1, fan: tower.fanSpeed, filter: tower.filterHealth },
    { time: 'Now', before: tower.pollutionBefore, after: tower.pollutionAfter, temp: tower.temperature, hum: tower.humidity, fan: tower.fanSpeed, filter: tower.filterHealth },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Live Node Telemetry Graphs</h3>
          <p className="text-xs text-slate-400">ESP32 Sensor Stream for {tower.name} ({tower.id})</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('pollution')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'pollution'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Before vs After</span>
          </button>

          <button
            onClick={() => setActiveTab('environment')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'environment'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp & Hum</span>
          </button>

          <button
            onClick={() => setActiveTab('fan')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'fan'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fan className="w-3.5 h-3.5" />
            <span>Blower Speed</span>
          </button>

          <button
            onClick={() => setActiveTab('filter')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'filter'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Filter Lifespan</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'pollution' ? (
            <AreaChart data={mockSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="before" name="MQ135 #1 (Intake Gas Response)" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBefore)" strokeWidth={2} />
              <Area type="monotone" dataKey="after" name="MQ135 #2 (Outlet Filtered Response)" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAfter)" strokeWidth={2} />
            </AreaChart>
          ) : activeTab === 'environment' ? (
            <LineChart data={mockSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="hum" name="Humidity (% RH)" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          ) : activeTab === 'fan' ? (
            <AreaChart data={mockSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Area type="monotone" dataKey="fan" name="Blower Fan Speed (%)" stroke="#10b981" fillOpacity={1} fill="url(#colorFan)" strokeWidth={2} />
            </AreaChart>
          ) : (
            <LineChart data={mockSeries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="filter" name="MERV-13 Filter Health (%)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
