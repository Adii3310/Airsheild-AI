'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Settings, MapPin, Radio, Sparkles, ShieldCheck, Save, CheckCircle2, Moon, Bell, Cpu, Cloud } from 'lucide-react';

export default function SettingsPage() {
  const { userLocation, updateUserLocation, isSimulationActive, toggleSimulation, startLiveDemo } = useApp();

  const [latInput, setLatInput] = useState(userLocation.lat.toString());
  const [lngInput, setLngInput] = useState(userLocation.lng.toString());
  const [nameInput, setNameInput] = useState(userLocation.name);
  const [isSaved, setIsSaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng) || !nameInput.trim()) {
      alert("Please enter valid numerical latitude, longitude, and location name.");
      return;
    }

    await updateUserLocation({ lat, lng, name: nameInput.trim() });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">System Settings & Grid Configuration</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure central grid origin coordinates, telemetry simulation modes, and system preferences.
          </p>
        </div>
      </div>

      {/* Grid Settings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. User Location Config Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Grid Origin Location</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Updates Map Center</span>
          </div>

          <form onSubmit={handleSaveLocation} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Location Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                placeholder="e.g. New Delhi Central Grid"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Latitude</label>
                <input
                  type="text"
                  value={latInput}
                  onChange={e => setLatInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  placeholder="28.6139"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Longitude</label>
                <input
                  type="text"
                  value={lngInput}
                  onChange={e => setLngInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                  placeholder="77.2090"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Saving shifts all 12 tower markers relative to new center location.
              </span>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-green transition-all"
              >
                {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? "Saved Location!" : "Save Location"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Simulation & Hackathon Demo Panel */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Live Telemetry Simulation</h2>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Development Mode</span>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Live Sensor Stream Tick</p>
                <p className="text-[11px] text-slate-400">Periodic subtle sensor fluctuations across all 12 towers.</p>
              </div>

              <button
                onClick={toggleSimulation}
                className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                  isSimulationActive
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isSimulationActive ? 'Active' : 'Paused'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <p className="font-semibold text-white">Prototype Presentation Demo</p>
                <p className="text-[11px] text-slate-400">Trigger 9-step interactive hackathon presentation sequence.</p>
              </div>

              <button
                onClick={() => startLiveDemo()}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-glow-green"
              >
                Launch Demo
              </button>
            </div>
          </div>
        </div>

        {/* 3. Notification & Theme Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white">Grid Notifications & Theme</h2>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span>Audible Critical Threshold Chime</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-4 h-4 rounded accent-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span>Theme Interface</span>
              <span className="font-mono text-emerald-400 font-bold">Dark Void (#080c14)</span>
            </div>
          </div>
        </div>

        {/* 4. System Information & Architecture */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold text-white">System Information</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Framework</span>
              <p className="text-white font-bold">Next.js App Router</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Language</span>
              <p className="text-emerald-400 font-bold">TypeScript</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Hardware Target</span>
              <p className="text-cyan-400 font-bold">ESP32-S3 Nodes</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-500 text-[10px]">Cloud Infrastructure</span>
              <p className="text-purple-400 font-bold">Firebase Ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
