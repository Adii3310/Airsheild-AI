import { Tower, TowerAlert, AIPrediction, UserLocation, TimeRange, HistoricalDataPoint } from '../types';
import { INITIAL_TOWERS, INITIAL_ALERTS, INITIAL_AI_PREDICTIONS, HISTORICAL_ANALYTICS, DEFAULT_USER_LOCATION } from '../mock/mockData';

export interface IDataService {
  getTowers(): Promise<Tower[]>;
  getTowerById(id: string): Promise<Tower | null>;
  getAlerts(): Promise<TowerAlert[]>;
  getAnalytics(timeRange: TimeRange): Promise<HistoricalDataPoint[]>;
  getPredictions(): Promise<AIPrediction[]>;
  getUserLocation(): Promise<UserLocation>;
  updateUserLocation(location: UserLocation): Promise<UserLocation>;
  updateTower(id: string, updates: Partial<Tower>): Promise<Tower | null>;
  acknowledgeAlert(alertId: string): Promise<boolean>;
  resolveAlert(alertId: string): Promise<boolean>;
}

export class MockDataService implements IDataService {
  private towers: Tower[] = [...INITIAL_TOWERS];
  private alerts: TowerAlert[] = [...INITIAL_ALERTS];
  private predictions: AIPrediction[] = [...INITIAL_AI_PREDICTIONS];
  private userLocation: UserLocation = { ...DEFAULT_USER_LOCATION };

  async getTowers(): Promise<Tower[]> {
    return [...this.towers];
  }

  async getTowerById(id: string): Promise<Tower | null> {
    const tower = this.towers.find(t => t.id.toLowerCase() === id.toLowerCase());
    return tower ? { ...tower } : null;
  }

  async getAlerts(): Promise<TowerAlert[]> {
    return [...this.alerts];
  }

  async getAnalytics(timeRange: TimeRange): Promise<HistoricalDataPoint[]> {
    // Generate scaled data points depending on time range
    if (timeRange === '1h') {
      return HISTORICAL_ANALYTICS.slice(-4);
    } else if (timeRange === '24h') {
      return HISTORICAL_ANALYTICS;
    } else if (timeRange === '7d') {
      return HISTORICAL_ANALYTICS.map((dp, i) => ({
        ...dp,
        timestamp: `Day ${i + 1}`,
        airProcessed: dp.airProcessed * 7
      }));
    } else {
      return HISTORICAL_ANALYTICS.map((dp, i) => ({
        ...dp,
        timestamp: `Week ${Math.floor(i / 3) + 1}`,
        airProcessed: dp.airProcessed * 30
      }));
    }
  }

  async getPredictions(): Promise<AIPrediction[]> {
    return [...this.predictions];
  }

  async getUserLocation(): Promise<UserLocation> {
    return { ...this.userLocation };
  }

  async updateUserLocation(location: UserLocation): Promise<UserLocation> {
    const latDiff = location.lat - this.userLocation.lat;
    const lngDiff = location.lng - this.userLocation.lng;

    this.userLocation = { ...location };

    // Shift towers relative to new user location
    this.towers = this.towers.map(tower => ({
      ...tower,
      latitude: Number((tower.latitude + latDiff).toFixed(4)),
      longitude: Number((tower.longitude + lngDiff).toFixed(4))
    }));

    return { ...this.userLocation };
  }

  async updateTower(id: string, updates: Partial<Tower>): Promise<Tower | null> {
    const index = this.towers.findIndex(t => t.id === id);
    if (index === -1) return null;

    const current = this.towers[index];
    const pollutionBefore = updates.pollutionBefore ?? current.pollutionBefore;
    const pollutionAfter = updates.pollutionAfter ?? current.pollutionAfter;
    
    // Auto calculate relative improvement efficiency %
    let efficiency = current.efficiency;
    if (pollutionBefore > 0) {
      efficiency = Number((((pollutionBefore - pollutionAfter) / pollutionBefore) * 100).toFixed(1));
      if (efficiency < 0) efficiency = 0;
    }

    const updatedTower: Tower = {
      ...current,
      ...updates,
      pollutionBefore,
      pollutionAfter,
      efficiency,
      lastUpdated: "Just now"
    };

    this.towers[index] = updatedTower;
    return { ...updatedTower };
  }

  async acknowledgeAlert(alertId: string): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
      return true;
    }
    return false;
  }

  async resolveAlert(alertId: string): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      return true;
    }
    return false;
  }
}

/**
 * FUTURE FIREBASE REAL-TIME SERVICE INTERFACE:
 * To switch to real IoT telemetry from ESP32-S3 towers via Firebase:
 * 
 * export class FirebaseDataService implements IDataService {
 *   // Connect to Firebase Firestore / Realtime DB
 * }
 */

// Centralized Data Service Singleton instance
export const dataService: IDataService = new MockDataService();
