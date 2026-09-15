'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Bell, Search, CheckCircle2, AlertTriangle, ShieldAlert, Info, Check, RotateCcw } from 'lucide-react';
import { AlertSeverity } from '@/lib/types';

export default function AlertsPage() {
  const { alerts, acknowledgeAlert, resolveAlert } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.towerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.towerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">Alert Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time threshold breach notifications and automated telemetry maintenance dispatches.
          </p>
        </div>

        {/* Counts summary */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40">
            {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length} Critical
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            {alerts.filter(a => a.severity === 'high' && a.status === 'active').length} High
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert description or tower..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alert List Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No Matching Grid Alerts</h3>
            <p className="text-xs text-slate-400">All physical nodes operating within optimal threshold ranges.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            return (
              <div
                key={alert.id}
                className={`glass-panel p-5 rounded-2xl border transition-all ${
                  alert.severity === 'critical' ? 'border-red-500/40 bg-red-950/20' :
                  alert.severity === 'high' ? 'border-amber-500/40 bg-amber-950/20' :
                  alert.severity === 'warning' ? 'border-amber-500/30 bg-slate-900/60' :
                  'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-glow-red/20' :
                        alert.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        alert.severity === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      }`}>
                        {alert.severity}
                      </span>

                      <span className="font-mono text-xs font-bold text-white">{alert.towerId} ({alert.towerName})</span>
                      <span className="text-[11px] text-slate-500">• {alert.timestamp}</span>

                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        alert.status === 'active' ? 'bg-red-950 text-red-400 border border-red-800' :
                        alert.status === 'acknowledged' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        Status: {alert.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-white leading-snug">{alert.description}</p>

                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300">
                      <strong className="text-emerald-400">Action Recommended:</strong> {alert.actionRecommended}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {alert.status === 'active' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    )}

                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Alert</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
