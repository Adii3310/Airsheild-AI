'use client';

import React from 'react';
import { TowerTable } from '@/components/towers/TowerTable';
import { useApp } from '@/lib/context/AppContext';
import { Cpu, CheckCircle2, AlertTriangle, PowerOff } from 'lucide-react';

export default function TowersPage() {
  const { towers, kpis } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Physical Tower Mesh Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed telemetry grid for all deployed ESP32-S3 filtration nodes.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{kpis.activeTowers} Active</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{kpis.alertTowers} Warnings</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 border border-slate-700">
            <PowerOff className="w-3.5 h-3.5" />
            <span>{kpis.offlineTowers} Offline</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <TowerTable towers={towers} />
    </div>
  );
}
