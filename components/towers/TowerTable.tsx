'use client';

import React, { useState } from 'react';
import { Tower } from '@/lib/types';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, Eye, Play, ArrowUpDown, Fan, Zap, Battery, Thermometer, Droplets } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface TowerTableProps {
  towers: Tower[];
}

type SortField = 'id' | 'name' | 'status' | 'pollutionBefore' | 'pollutionAfter' | 'efficiency' | 'filterHealth' | 'powerConsumption';

export const TowerTable: React.FC<TowerTableProps> = ({ towers }) => {
  const { startLiveDemo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search
  const filtered = towers.filter(tower => {
    const matchesSearch =
      tower.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tower.locationName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || tower.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string') valA = (valA as string).toLowerCase();
    if (typeof valB === 'string') valB = (valB as string).toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, name, or location..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="all">All Statuses ({towers.length})</option>
            <option value="active">Active ({towers.filter(t=>t.status==='active').length})</option>
            <option value="warning">Warning ({towers.filter(t=>t.status==='warning').length})</option>
            <option value="critical">Critical ({towers.filter(t=>t.status==='critical').length})</option>
            <option value="offline">Offline ({towers.filter(t=>t.status==='offline').length})</option>
          </select>
        </div>
      </div>

      {/* Table Canvas */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>Tower ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Location / Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('status')}>
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pollutionBefore')}>
                <div className="flex items-center gap-1">
                  <span>MQ135 #1 (Before)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('pollutionAfter')}>
                <div className="flex items-center gap-1">
                  <span>MQ135 #2 (After)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('efficiency')}>
                <div className="flex items-center gap-1">
                  <span>Rel. Improvement</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Fan Speed</th>
              <th className="py-3 px-3">Temp / Hum</th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => toggleSort('filterHealth')}>
                <div className="flex items-center gap-1">
                  <span>Filter Health</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Power / Battery</th>
              <th className="py-3 px-3">Updated</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-8 text-center text-slate-500">
                  No towers match your search criteria.
                </td>
              </tr>
            ) : (
              paginated.map(tower => (
                <tr key={tower.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white">{tower.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-white">{tower.name}</p>
                    <p className="text-[10px] text-slate-400">{tower.locationName}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      tower.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      tower.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      tower.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {tower.status}
                    </span>
                  </td>
                  <td className={`py-3 px-3 font-mono font-bold ${tower.pollutionBefore > 600 ? 'text-red-400' : 'text-amber-400'}`}>
                    {tower.pollutionBefore} <span className="text-[10px] text-slate-500">units</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                    {tower.pollutionAfter} <span className="text-[10px] text-slate-500">units</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-extrabold text-emerald-400">
                    +{tower.efficiency}%
                  </td>
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-1">
                      <Fan className={`w-3.5 h-3.5 text-cyan-400 ${tower.fanSpeed > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
                      <span>{tower.fanSpeed}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div>{tower.temperature}°C</div>
                    <div className="text-slate-400">{tower.humidity}% RH</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-20 bg-slate-950 rounded-full h-1.5 overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${tower.filterHealth > 50 ? 'bg-emerald-500' : tower.filterHealth > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${tower.filterHealth}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{tower.filterHealth}% MERV</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <div>{tower.powerConsumption}W</div>
                    <div className="text-slate-400">{tower.batteryLevel}% Bat</div>
                  </td>
                  <td className="py-3 px-3 text-[10px] text-slate-400">{tower.lastUpdated}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => startLiveDemo(tower.id)}
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                        title="Run Prototype Demo on this Tower"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                      </button>
                      <Link
                        href={`/towers/${tower.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>Showing {paginated.length} of {sorted.length} towers</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 font-mono">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
