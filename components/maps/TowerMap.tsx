'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useApp } from '@/lib/context/AppContext';
import { Search, Layers, Flame, SlidersHorizontal, Info, ShieldCheck } from 'lucide-react';
import { TowerStatus } from '@/lib/types';

// Dynamic import with SSR false for Leaflet browser rendering safety
const TowerMapLeaflet = dynamic(
  () => import('./TowerMapLeaflet').then(mod => mod.TowerMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] rounded-2xl glass-panel flex flex-col items-center justify-center space-y-3 bg-slate-950">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium text-slate-400">Loading Interactive Smart Grid Map...</span>
      </div>
    )
  }
);

export const TowerMap: React.FC = () => {
  const { towers, userLocation, selectedTowerId, setSelectedTowerId } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pollutionFilter, setPollutionFilter] = useState<string>('all');
  const [efficiencyFilter, setEfficiencyFilter] = useState<string>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Filter towers based on search and selected filters
  const filteredTowers = towers.filter(tower => {
    // Search
    const matchesSearch =
      tower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tower.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tower.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status
    const matchesStatus = statusFilter === 'all' || tower.status === statusFilter;

    // Pollution Filter
    let matchesPollution = true;
    if (pollutionFilter === 'low') matchesPollution = tower.pollutionBefore < 400;
    if (pollutionFilter === 'moderate') matchesPollution = tower.pollutionBefore >= 400 && tower.pollutionBefore <= 650;
    if (pollutionFilter === 'high') matchesPollution = tower.pollutionBefore > 650;

    // Efficiency Filter
    let matchesEfficiency = true;
    if (efficiencyFilter === 'high') matchesEfficiency = tower.efficiency >= 55;
    if (efficiencyFilter === 'low') matchesEfficiency = tower.efficiency < 55;

    return matchesSearch && matchesStatus && matchesPollution && matchesEfficiency;
  });

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tower, ID, or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="critical">Critical (Red)</option>
              <option value="offline">Offline (Gray)</option>
            </select>

            {/* Pollution Response Filter */}
            <select
              value={pollutionFilter}
              onChange={e => setPollutionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Gas Levels</option>
              <option value="low">Low (&lt; 400 units)</option>
              <option value="moderate">Moderate (400-650)</option>
              <option value="high">High (&gt; 650 units)</option>
            </select>

            {/* Efficiency Filter */}
            <select
              value={efficiencyFilter}
              onChange={e => setEfficiencyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Efficiencies</option>
              <option value="high">High Efficiency (&ge; 55%)</option>
              <option value="low">Lower Efficiency (&lt; 55%)</option>
            </select>

            {/* Heatmap Toggle */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                showHeatmap
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-glow-amber/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-400 animate-bounce' : ''}`} />
              <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Scientific Accuracy Disclaimer Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-slate-300">Technical Note:</strong> Values represent MQ135 relative gas/pollution response levels (NOT certified AQI or PM2.5). Showing {filteredTowers.length} of {towers.length} nodes around <strong className="text-emerald-400">{userLocation.name}</strong>.
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[620px] rounded-2xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
        <TowerMapLeaflet
          towers={filteredTowers}
          userLocation={userLocation}
          showHeatmap={showHeatmap}
          selectedTowerId={selectedTowerId}
          onSelectTower={setSelectedTowerId}
        />

        {/* Heatmap Legend */}
        {showHeatmap && (
          <div className="absolute bottom-4 right-4 z-[1000] p-3 rounded-xl glass-panel bg-slate-950/90 border border-slate-800 text-xs text-slate-300 space-y-1.5 shadow-xl">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Pollution Response Heatmap</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Low (&lt; 400 units)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Moderate (400 - 650 units)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>Critical (&gt; 650 units)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
