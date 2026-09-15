'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Tower, UserLocation } from '@/lib/types';
import Link from 'next/link';
import { Fan, Thermometer, Droplets, Battery, Zap, ChevronRight, Activity } from 'lucide-react';

interface TowerMapLeafletProps {
  towers: Tower[];
  userLocation: UserLocation;
  showHeatmap: boolean;
  selectedTowerId: string | null;
  onSelectTower: (id: string) => void;
}

// Custom Leaflet Marker Icon Generator using SVG Data URIs
const createCustomIcon = (status: Tower['status']) => {
  let color = '#10b981'; // Green active
  if (status === 'warning') color = '#f59e0b'; // Yellow warning
  if (status === 'critical') color = '#ef4444'; // Red critical
  if (status === 'offline') color = '#64748b'; // Gray offline

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40">
      <filter id="glow-${status}">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <path d="M16 0 C7.16 0 0 7.16 0 16 C0 26.5 16 40 16 40 C16 40 32 26.5 32 16 C32 7.16 24.84 0 16 0 Z" fill="${color}" filter="url(#glow-${status})" opacity="0.95"/>
      <circle cx="16" cy="15" r="7" fill="#080c14"/>
      <circle cx="16" cy="15" r="4" fill="${color}"/>
    </svg>
  `;

  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
};

const UserLocationIcon = L.icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="#06b6d4" opacity="0.3"/>
      <circle cx="16" cy="16" r="8" fill="#06b6d4" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="16" r="3" fill="#ffffff"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to dynamically recenter map when location changes
const ChangeMapView: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const TowerMapLeaflet: React.FC<TowerMapLeafletProps> = ({
  towers,
  userLocation,
  showHeatmap,
  selectedTowerId,
  onSelectTower
}) => {
  const center: [number, number] = [userLocation.lat, userLocation.lng];

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
    >
      <ChangeMapView center={center} />

      {/* Dark Theme CartoDB / OpenStreetMap Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Configurable User Center Location Marker */}
      <Marker position={center} icon={UserLocationIcon}>
        <Popup>
          <div className="p-1 space-y-1 text-xs">
            <span className="font-bold text-cyan-400">User Grid Location</span>
            <p className="text-slate-300">{userLocation.name}</p>
            <p className="font-mono text-[10px] text-slate-500">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
          </div>
        </Popup>
      </Marker>

      {/* Pollution Heatmap Overlay Circles */}
      {showHeatmap && towers.map(tower => {
        if (tower.status === 'offline') return null;
        let circleColor = '#10b981'; // Green
        let radius = 250;
        if (tower.pollutionBefore > 400) { circleColor = '#eab308'; radius = 350; }
        if (tower.pollutionBefore > 650) { circleColor = '#ef4444'; radius = 500; }

        return (
          <CircleMarker
            key={`heat-${tower.id}`}
            center={[tower.latitude, tower.longitude]}
            radius={radius / 15}
            pathOptions={{
              color: circleColor,
              fillColor: circleColor,
              fillOpacity: 0.35,
              weight: 1
            }}
          />
        );
      })}

      {/* Tower Status Markers */}
      {towers.map(tower => (
        <Marker
          key={tower.id}
          position={[tower.latitude, tower.longitude]}
          icon={createCustomIcon(tower.status)}
          eventHandlers={{
            click: () => onSelectTower(tower.id)
          }}
        >
          <Popup>
            <div className="w-64 p-2 space-y-2.5 text-xs text-slate-200">
              {/* Popup Header */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-white">{tower.name}</h4>
                  <span className="font-mono text-[10px] text-slate-400">{tower.id} • {tower.locationName}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  tower.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  tower.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  tower.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {tower.status}
                </span>
              </div>

              {/* Sensor Response Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400">MQ135 #1 (Intake)</p>
                  <p className={`font-mono font-bold text-sm ${tower.pollutionBefore > 600 ? 'text-red-400' : 'text-amber-400'}`}>
                    {tower.pollutionBefore} units
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">MQ135 #2 (Outlet)</p>
                  <p className="font-mono font-bold text-sm text-cyan-400">
                    {tower.pollutionAfter} units
                  </p>
                </div>
              </div>

              {/* Relative Improvement */}
              <div className="flex items-center justify-between bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                <span className="text-[11px] font-medium text-slate-300">Relative Improvement</span>
                <span className="font-mono font-extrabold text-sm text-emerald-400">+{tower.efficiency}%</span>
              </div>

              {/* Quick Environmental & System Telemetry */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <Fan className="w-3 h-3 text-cyan-400" />
                  <span>{tower.fanSpeed}% Speed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span>{tower.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-400" />
                  <span>{tower.humidity}% RH</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>{tower.filterHealth}% Filter</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>{tower.powerConsumption}W</span>
                </div>
                <div className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  <span>{tower.batteryLevel}%</span>
                </div>
              </div>

              <p className="text-[9px] text-slate-500 italic text-center">Updated: {tower.lastUpdated}</p>

              {/* Link CTA */}
              <Link
                href={`/towers/${tower.id}`}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors font-semibold text-xs text-center"
              >
                <span>View Airflow & Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
