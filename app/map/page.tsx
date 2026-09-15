'use client';

import React from 'react';
import { TowerMap } from '@/components/maps/TowerMap';
import { Map, Flame, Info } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

export default function LiveMapPage() {
  const { userLocation } = useApp();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Live Grid Spatial Map</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive OpenStreetMap telemetry centered at <strong className="text-cyan-400">{userLocation.name}</strong> ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
          </p>
        </div>
      </div>

      {/* Main Map Component */}
      <TowerMap />
    </div>
  );
}
