'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, Circle, Play, X, ShieldAlert, Cpu, Fan, Sparkles, ArrowRight, Activity } from 'lucide-react';

export const DemoModeModal: React.FC = () => {
  const { demoState, stopLiveDemo, towers } = useApp();

  if (!demoState.isRunning) return null;

  const targetTower = towers.find(t => t.id === demoState.targetTowerId) || towers[0];
  const currentStepInfo = demoState.steps.find(s => s.stepNumber === demoState.currentStep) || demoState.steps[0];
  const progressPercent = Math.round((demoState.currentStep / demoState.steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-panel bg-[#0b1120]/95 border-emerald-500/40 rounded-2xl shadow-glow-green overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">PROTOTYPE LIVE DEMO MODE</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  STEP {demoState.currentStep} OF 9
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Node: <span className="text-emerald-400 font-semibold">{targetTower?.name} ({targetTower?.id})</span>
              </p>
            </div>
          </div>
          <button
            onClick={stopLiveDemo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Step Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900/90 to-slate-900/40 border border-emerald-500/30 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-slate-800/80 text-cyan-400 border border-slate-700 shrink-0">
              <Activity className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Current Phase</span>
                <span className="text-xs font-mono text-slate-500">• {currentStepInfo.activeComponent}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{currentStepInfo.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{currentStepInfo.description}</p>
            </div>
          </div>

          {/* Live Sensor Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <p className="text-[11px] text-slate-400">MQ135 #1 (Intake)</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-xl font-bold font-mono ${targetTower.pollutionBefore > 600 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {targetTower.pollutionBefore}
                </span>
                <span className="text-[10px] text-slate-500">response units</span>
              </div>
              <span className="text-[10px] text-slate-400">Raw Gas Response</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <p className="text-[11px] text-slate-400">MQ135 #2 (Outlet)</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-cyan-400">
                  {targetTower.pollutionAfter}
                </span>
                <span className="text-[10px] text-slate-500">response units</span>
              </div>
              <span className="text-[10px] text-slate-400">Filtered Output</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <p className="text-[11px] text-slate-400">Blower Fan Speed</p>
              <div className="flex items-center gap-2 mt-1">
                <Fan className={`w-4 h-4 text-emerald-400 ${targetTower.fanSpeed > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: `${1000 / (targetTower.fanSpeed || 1)}ms` }} />
                <span className="text-xl font-bold font-mono text-white">{targetTower.fanSpeed}%</span>
              </div>
              <span className="text-[10px] text-slate-400">PWM Control</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <p className="text-[11px] text-slate-400">Relative Improvement</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-emerald-400">+{targetTower.efficiency}%</span>
              </div>
              <span className="text-[10px] text-slate-400">Relative Reduction</span>
            </div>
          </div>

          {/* Timeline Steps List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Execution Timeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {demoState.steps.map((step) => {
                const isActive = step.stepNumber === demoState.currentStep;
                const isPassed = step.stepNumber < demoState.currentStep || step.isComplete;

                return (
                  <div
                    key={step.stepNumber}
                    className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 transition-all ${
                      isActive
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-glow-green/30'
                        : isPassed
                        ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                        : 'bg-slate-950/40 border-slate-900 text-slate-600'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-700 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-semibold truncate">{step.stepNumber}. {step.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>Prototype hardware-free simulation engine</span>
          <button
            onClick={stopLiveDemo}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {demoState.currentStep >= 9 ? "Complete & Close" : "Stop Demo"}
          </button>
        </div>
      </div>
    </div>
  );
};
