'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Filter, ShieldAlert, CheckCircle2, AlertTriangle, Clock, Wrench, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  const { towers } = useApp();

  const maintenanceList = towers.map(tower => {
    const isMervLow = tower.filterHealth < 30;
    const isCarbonLow = tower.carbonFilterHealth < 30;
    const isReplacementNeeded = isMervLow || isCarbonLow;

    const remainingHours = Math.round((tower.filterHealth / 100) * 1200); // 1200 max rated filter hours

    return {
      tower,
      isMervLow,
      isCarbonLow,
      isReplacementNeeded,
      remainingHours,
      lastService: "14 days ago",
      nextService: isReplacementNeeded ? "Immediate Attention Required" : "In 45 days"
    };
  });

  const overallAvgMerv = Math.round(towers.reduce((acc, t) => acc + t.filterHealth, 0) / towers.length);
  const overallAvgCarbon = Math.round(towers.reduce((acc, t) => acc + t.carbonFilterHealth, 0) / towers.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Filter & Maintenance Monitoring</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical MERV-13 particulate interception & activated carbon VOC adsorption matrix lifespan tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
            MERV-13 Avg: {overallAvgMerv}%
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold">
            Carbon Avg: {overallAvgCarbon}%
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenanceList.map(({ tower, isMervLow, isCarbonLow, isReplacementNeeded, remainingHours, lastService, nextService }) => (
          <div
            key={tower.id}
            className={`glass-panel p-5 rounded-2xl border transition-all ${
              isReplacementNeeded ? 'border-red-500/40 bg-red-950/20 shadow-glow-red/20' : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">{tower.name}</h3>
                  <span className="font-mono text-[10px] text-slate-400">{tower.id} • {tower.locationName}</span>
                </div>
                {isReplacementNeeded ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                    Replace Filter
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Optimal
                  </span>
                )}
              </div>

              {/* Progress Bars */}
              <div className="space-y-3">
                {/* MERV-13 */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">MERV-13 Particulate Filter</span>
                    <span className={`font-mono font-bold ${isMervLow ? 'text-red-400' : 'text-emerald-400'}`}>
                      {tower.filterHealth}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isMervLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${tower.filterHealth}%` }}
                    />
                  </div>
                </div>

                {/* Carbon */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">Activated Carbon Gas Filter</span>
                    <span className={`font-mono font-bold ${isCarbonLow ? 'text-red-400' : 'text-cyan-400'}`}>
                      {tower.carbonFilterHealth}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isCarbonLow ? 'bg-red-500' : 'bg-cyan-500'}`}
                      style={{ width: `${tower.carbonFilterHealth}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500">Est. Remaining Life</span>
                  <p className="font-mono font-bold text-white mt-0.5">{remainingHours} hrs</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500">Last Maintenance</span>
                  <p className="text-slate-300 font-medium mt-0.5">{lastService}</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
                <span>Next Service: <strong className={isReplacementNeeded ? 'text-red-400' : 'text-emerald-400'}>{nextService}</strong></span>
                <Link
                  href={`/towers/${tower.id}`}
                  className="text-emerald-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
