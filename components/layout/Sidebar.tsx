'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Map, 
  Cpu, 
  BarChart3, 
  BrainCircuit, 
  Bell, 
  Filter, 
  Zap, 
  Settings,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export const navItems = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Live Map', href: '/map', icon: Map },
  { name: 'Towers', href: '/towers', icon: Cpu },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Predictions', href: '/ai-predictions', icon: BrainCircuit },
  { name: 'Alerts', href: '/alerts', icon: Bell, badgeKey: 'alerts' },
  { name: 'Filters & Maintenance', href: '/maintenance', icon: Filter },
  { name: 'Energy', href: '/energy', icon: Zap },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { alerts, kpis } = useApp();
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col glass-panel border-r border-slate-800 bg-[#080c14]/95 min-h-[calc(100vh-65px)] p-4 space-y-6">
      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Grid Navigation
        </p>
        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const badgeCount = item.badgeKey === 'alerts' ? activeAlertsCount : null;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 text-emerald-400 border border-emerald-500/30 shadow-glow-green/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 hover:border-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>
                {badgeCount !== null && badgeCount > 0 ? (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
                    {badgeCount}
                  </span>
                ) : (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 text-emerald-400' : 'text-slate-600'}`} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Status Mini Widget */}
      <div className="mt-auto p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">Smart Mesh Active</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">99.4%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full w-[99.4%]" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 pt-1">
          <span>Towers Online: {kpis.activeTowers}/{kpis.totalTowers}</span>
          <span>ESP32 Telemetry</span>
        </div>
      </div>
    </aside>
  );
};
