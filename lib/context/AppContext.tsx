'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tower, TowerAlert, UserLocation, SystemKPIs, AIPrediction } from '../types';
import { dataService } from '../services/DataService';
import { DEFAULT_USER_LOCATION } from '../mock/mockData';

export interface DemoStepInfo {
  stepNumber: number;
  title: string;
  description: string;
  activeComponent: string;
  isComplete: boolean;
}

export interface DemoState {
  isRunning: boolean;
  currentStep: number;
  targetTowerId: string;
  steps: DemoStepInfo[];
}

interface AppContextType {
  towers: Tower[];
  alerts: TowerAlert[];
  predictions: AIPrediction[];
  userLocation: UserLocation;
  kpis: SystemKPIs;
  isSimulationActive: boolean;
  demoState: DemoState;
  selectedTowerId: string | null;
  setSelectedTowerId: (id: string | null) => void;
  toggleSimulation: () => void;
  updateUserLocation: (location: UserLocation) => Promise<void>;
  startLiveDemo: (towerId?: string) => void;
  stopLiveDemo: () => void;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  updateTower: (id: string, updates: Partial<Tower>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const INITIAL_DEMO_STEPS: DemoStepInfo[] = [
  { stepNumber: 1, title: "Normal Air Baseline", description: "Monitoring baseline ambient conditions with MQ135 #1.", activeComponent: "MQ135 #1 Baseline", isComplete: false },
  { stepNumber: 2, title: "Pollution Spike Detected", description: "MQ135 #1 relative gas response spikes sharply to 880 units.", activeComponent: "MQ135 #1 Intake Sensor", isComplete: false },
  { stepNumber: 3, title: "Critical Alert Generated", description: "System triggers immediate Critical Pollution warning in Grid Command.", activeComponent: "Alert Management System", isComplete: false },
  { stepNumber: 4, title: "Intake Blower Activation", description: "ESP32 PWM controller ramps up intake blower fan speed to 100%.", activeComponent: "Intake Fan Blower", isComplete: false },
  { stepNumber: 5, title: "Dual Stage Filtration", description: "Air streams through MERV-13 particulate filter + Activated Carbon gas adsorption layer.", activeComponent: "MERV-13 & Carbon Filters", isComplete: false },
  { stepNumber: 6, title: "Sensor Response Drops", description: "Outlet MQ135 #2 relative pollution reading decreases rapidly to 180 units.", activeComponent: "MQ135 #2 Outlet Sensor", isComplete: false },
  { stepNumber: 7, title: "Relative Improvement Calculated", description: "79.5% relative gas response reduction achieved across filtration matrix.", activeComponent: "AI Calculation Engine", isComplete: false },
  { stepNumber: 8, title: "Tower Grid Recovery", description: "Tower status transitions from Critical Red to Optimal Active Green.", activeComponent: "Smart Grid Command Map", isComplete: false },
  { stepNumber: 9, title: "System Stabilized", description: "Live dashboard, maps, charts, and table metrics synchronized.", activeComponent: "Airsheild AI Ecosystem", isComplete: false }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [alerts, setAlerts] = useState<TowerAlert[]>([]);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(true);
  const [selectedTowerId, setSelectedTowerId] = useState<string | null>(null);

  const [demoState, setDemoState] = useState<DemoState>({
    isRunning: false,
    currentStep: 0,
    targetTowerId: 'T-006',
    steps: INITIAL_DEMO_STEPS
  });

  // Calculate dynamic KPIs from towers list
  const kpis: SystemKPIs = React.useMemo(() => {
    const totalTowers = towers.length;
    const activeTowers = towers.filter(t => t.status === 'active').length;
    const offlineTowers = towers.filter(t => t.status === 'offline').length;
    const alertTowers = towers.filter(t => t.status === 'warning' || t.status === 'critical').length;
    
    const activeList = towers.filter(t => t.status !== 'offline');
    const avgRelativeImprovement = activeList.length > 0
      ? Number((activeList.reduce((acc, t) => acc + t.efficiency, 0) / activeList.length).toFixed(1))
      : 54.0;
    
    const totalAirProcessed = towers.reduce((acc, t) => acc + t.airProcessed, 0);

    return {
      totalTowers: totalTowers || 12,
      activeTowers: activeTowers || 9,
      offlineTowers: offlineTowers || 1,
      alertTowers: alertTowers || 2,
      avgRelativeImprovement: avgRelativeImprovement || 54.0,
      totalAirProcessed: totalAirProcessed || 18420
    };
  }, [towers]);

  const refreshData = useCallback(async () => {
    const [fetchedTowers, fetchedAlerts, fetchedPredictions, fetchedLoc] = await Promise.all([
      dataService.getTowers(),
      dataService.getAlerts(),
      dataService.getPredictions(),
      dataService.getUserLocation()
    ]);
    setTowers(fetchedTowers);
    setAlerts(fetchedAlerts);
    setPredictions(fetchedPredictions);
    setUserLocation(fetchedLoc);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live Simulation Interval
  useEffect(() => {
    if (!isSimulationActive || demoState.isRunning) return;

    const interval = setInterval(() => {
      setTowers(prevTowers =>
        prevTowers.map(tower => {
          if (tower.status === 'offline') return tower;

          // Gradual realistic simulation updates
          const pollutionDelta = (Math.random() - 0.48) * 12;
          const newBefore = Math.max(150, Math.min(900, Math.round(tower.pollutionBefore + pollutionDelta)));
          const efficiencyFactor = 0.58 + (Math.random() - 0.5) * 0.04;
          const newAfter = Math.max(50, Math.round(newBefore * (1 - efficiencyFactor)));
          const newEfficiency = Number((((newBefore - newAfter) / newBefore) * 100).toFixed(1));

          const newTemp = Number((tower.temperature + (Math.random() - 0.5) * 0.1).toFixed(1));
          const newHum = Math.max(30, Math.min(80, Math.round(tower.humidity + (Math.random() - 0.5) * 0.4)));
          const newAirProcessed = tower.airProcessed + Math.round((tower.fanSpeed / 100) * 3);

          return {
            ...tower,
            pollutionBefore: newBefore,
            pollutionAfter: newAfter,
            efficiency: newEfficiency,
            temperature: newTemp,
            humidity: newHum,
            airProcessed: newAirProcessed,
            lastUpdated: "Just now"
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationActive, demoState.isRunning]);

  // Hackathon Prototype Demo Controller
  const startLiveDemo = useCallback((towerId?: string) => {
    const targetId = towerId || selectedTowerId || 'T-006';
    setDemoState({
      isRunning: true,
      currentStep: 1,
      targetTowerId: targetId,
      steps: INITIAL_DEMO_STEPS.map(s => ({ ...s, isComplete: false }))
    });
  }, [selectedTowerId]);

  const stopLiveDemo = useCallback(() => {
    setDemoState(prev => ({ ...prev, isRunning: false, currentStep: 0 }));
  }, []);

  // Prototype Demo Step Sequence Engine
  useEffect(() => {
    if (!demoState.isRunning) return;

    const stepDuration = 1600; // 1.6s per step for clear presentation
    const targetId = demoState.targetTowerId;

    const stepTimer = setTimeout(() => {
      const current = demoState.currentStep;

      // Execute side-effects for each demo step
      if (current === 1) {
        // Step 1: Baseline air
        dataService.updateTower(targetId, {
          pollutionBefore: 360,
          pollutionAfter: 150,
          fanSpeed: 50,
          status: 'active'
        });
      } else if (current === 2) {
        // Step 2: Severe pollution spike
        dataService.updateTower(targetId, {
          pollutionBefore: 880,
          pollutionAfter: 480,
          status: 'critical'
        });
      } else if (current === 3) {
        // Step 3: Critical alert added
        const newAlert: TowerAlert = {
          id: `ALT-DEMO-${Date.now()}`,
          towerId: targetId,
          towerName: towers.find(t => t.id === targetId)?.name || "Target Tower",
          timestamp: "Just now",
          severity: "critical",
          description: `CRITICAL DEMO SPIKE: High gas response (880 units) detected on ${targetId}`,
          status: "active",
          actionRecommended: "Intake blower automated max throttle engaged."
        };
        setAlerts(prev => [newAlert, ...prev]);
      } else if (current === 4) {
        // Step 4: Fan ramps to 100%
        dataService.updateTower(targetId, { fanSpeed: 100 });
      } else if (current === 5) {
        // Step 5: Air passes through dual filtration matrix
      } else if (current === 6) {
        // Step 6: Outlet sensor drops dramatically
        dataService.updateTower(targetId, { pollutionAfter: 180 });
      } else if (current === 7) {
        // Step 7: Calculate relative improvement
        dataService.updateTower(targetId, { efficiency: 79.5 });
      } else if (current === 8) {
        // Step 8: Tower status changes to active green
        dataService.updateTower(targetId, { status: 'active', fanSpeed: 75 });
      }

      refreshData();

      if (current < 9) {
        setDemoState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          steps: prev.steps.map((s, idx) => idx + 1 <= current ? { ...s, isComplete: true } : s)
        }));
      } else {
        // Step 9 complete
        setDemoState(prev => ({
          ...prev,
          steps: prev.steps.map(s => ({ ...s, isComplete: true }))
        }));
      }
    }, stepDuration);

    return () => clearTimeout(stepTimer);
  }, [demoState.isRunning, demoState.currentStep, demoState.targetTowerId, refreshData, towers]);

  const toggleSimulation = () => setIsSimulationActive(prev => !prev);

  const updateUserLocation = async (newLoc: UserLocation) => {
    const updatedLoc = await dataService.updateUserLocation(newLoc);
    setUserLocation(updatedLoc);
    refreshData();
  };

  const updateTower = async (id: string, updates: Partial<Tower>) => {
    await dataService.updateTower(id, updates);
    refreshData();
  };

  const acknowledgeAlert = async (id: string) => {
    await dataService.acknowledgeAlert(id);
    refreshData();
  };

  const resolveAlert = async (id: string) => {
    await dataService.resolveAlert(id);
    refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        towers,
        alerts,
        predictions,
        userLocation,
        kpis,
        isSimulationActive,
        demoState,
        selectedTowerId,
        setSelectedTowerId,
        toggleSimulation,
        updateUserLocation,
        startLiveDemo,
        stopLiveDemo,
        acknowledgeAlert,
        resolveAlert,
        updateTower,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
