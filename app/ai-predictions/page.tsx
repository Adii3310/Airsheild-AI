'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { BrainCircuit, AlertTriangle, TrendingUp, Sparkles, CheckCircle2, ShieldAlert, Info, ArrowUpRight, Fan } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function AIPredictionsPage() {
  const { predictions, towers } = useApp();

  const predictionGraphData = [
    { time: 'Current', actual: 780, predicted: 780 },
    { time: '+10 mins', actual: null, predicted: 810 },
    { time: '+20 mins', actual: null, predicted: 840 },
    { time: '+30 mins', actual: null, predicted: 860 },
    { time: '+40 mins', actual: null, predicted: 820 },
    { time: '+50 mins', actual: null, predicted: 750 },
    { time: '+60 mins', actual: null, predicted: 680 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-extrabold text-white">AI Pollution Prediction & Decision Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine Learning forecasting of near-future pollution spikes to preemptively activate blower fans.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Predictive Control Active</span>
        </span>
      </div>

      {/* PROTOTYPE AI DECISION SUPPORT DISCLAIMER PANEL */}
      <div className="p-5 rounded-2xl glass-panel border border-purple-500/40 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 space-y-3">
        <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <h2>Prototype AI Decision Support Framework</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-purple-300">Disclaimer:</strong> This is a prototype predictive decision system trained on historical MQ135 sensor streams, ambient microclimate factors, and spatial mesh dynamics. It is intended for real-time proactive tower speed optimization and is NOT an official meteorologically certified environmental forecasting system.
        </p>

        {/* Input Features Pipeline */}
        <div className="pt-2 border-t border-purple-900/50">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Model Input Feature Vector</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Historical Gas Response</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Ambient Temp (°C)</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Relative Humidity (%)</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Traffic Peak Hours</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Spatial Mesh Offsets</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Nearby Tower Telemetry</span>
          </div>
        </div>
      </div>

      {/* Main Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction Cards */}
        {predictions.map(pred => (
          <div key={pred.towerId} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">{pred.towerName}</h3>
                  <span className="font-mono text-[10px] text-slate-400">{pred.towerId}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  pred.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  pred.riskLevel === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {pred.riskLevel} Risk
                </span>
              </div>

              {/* Current vs Predicted Metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <div>
                  <p className="text-[11px] text-slate-400">Current Gas Level</p>
                  <p className="font-mono font-bold text-lg text-white mt-0.5">{pred.currentPollution}</p>
                  <span className="text-[10px] text-slate-500">MQ135 #1 units</span>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Predicted Level</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="font-mono font-extrabold text-lg text-purple-400">{pred.predictedPollution}</p>
                    <ArrowUpRight className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-[10px] text-slate-500">{pred.timeWindow}</span>
                </div>
              </div>

              {/* Confidence & Recommendations */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Model Confidence Score:</span>
                  <span className="font-mono font-bold text-purple-400">{pred.confidence}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full" style={{ width: `${pred.confidence}%` }} />
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>AI Speed Recommendation</span>
                    <span className="font-mono font-bold text-white">{pred.recommendedFanSpeed}% Fan</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Preemptive throttle up suggested to counteract anticipated gas surge.
                  </p>
                </div>
              </div>

              {/* Multi-factor Explanation */}
              <div className="space-y-1 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <p><strong className="text-slate-300">Primary Factor:</strong> {pred.factors.historicalTrend}</p>
                <p><strong className="text-slate-300">Humidity Influence:</strong> {pred.factors.humidityImpact}</p>
                <p><strong className="text-slate-300">Thermal Influence:</strong> {pred.factors.temperatureImpact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Curve Recharts Graph */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">60-Minute Forecast Trajectory vs Real Sensor Stream</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">T-003 Industrial Forecast</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={predictionGraphData}>
              <defs>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="actual" name="Actual MQ135 #1 Stream" stroke="#06b6d4" fill="transparent" strokeWidth={3} />
              <Area type="monotone" dataKey="predicted" name="AI Model Predicted Curve" stroke="#a855f7" fill="url(#predGrad)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
