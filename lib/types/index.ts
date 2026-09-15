export type TowerStatus = 'active' | 'warning' | 'critical' | 'offline';

export interface Tower {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: TowerStatus;
  pollutionBefore: number; // MQ135 Sensor #1 Relative Gas/Pollution Response
  pollutionAfter: number;  // MQ135 Sensor #2 Relative Gas/Pollution Response
  efficiency: number;       // Relative Improvement %
  fanSpeed: number;        // Percentage 0-100%
  temperature: number;     // Celsius
  humidity: number;        // Percentage
  filterHealth: number;    // MERV-13 Filter Health %
  carbonFilterHealth: number; // Activated Carbon Filter Health %
  powerConsumption: number; // Watts (INA219 architecture)
  batteryLevel: number;    // Percentage
  airProcessed: number;    // Cubic meters (m³)
  lastUpdated: string;
  locationName: string;
}

export type AlertSeverity = 'critical' | 'high' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface TowerAlert {
  id: string;
  towerId: string;
  towerName: string;
  timestamp: string;
  severity: AlertSeverity;
  description: string;
  status: AlertStatus;
  actionRecommended: string;
}

export interface AIPrediction {
  towerId: string;
  towerName: string;
  currentPollution: number;
  predictedPollution: number;
  timeWindow: string; // e.g. "Next 30 mins"
  confidence: number; // e.g. 87%
  recommendedFanSpeed: number;
  recommendedActivation: boolean;
  trend: 'rising' | 'falling' | 'stable';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: {
    historicalTrend: string;
    humidityImpact: string;
    temperatureImpact: string;
    nearbyTowersStatus: string;
  };
}

export interface UserLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface SystemKPIs {
  totalTowers: number;
  activeTowers: number;
  offlineTowers: number;
  alertTowers: number;
  avgRelativeImprovement: number; // %
  totalAirProcessed: number;      // m³
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface HistoricalDataPoint {
  timestamp: string;
  pollutionBefore: number;
  pollutionAfter: number;
  efficiency: number;
  fanSpeed: number;
  power: number;
  airProcessed: number;
}
