import { riskMapSummary, mapMarkers, hotspots, getAreaDetails } from '../data/riskMapData';

export const riskMapService = {
  getSummary: async () => {
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(riskMapSummary), 500));
  },
  
  getMapMarkers: async (filters = {}) => {
    // Simulate API call with optional filtering
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mapMarkers];
        if (filters.state) filtered = filtered.filter(m => m.state === filters.state);
        if (filters.district) filtered = filtered.filter(m => m.district === filters.district);
        if (filters.animalType) filtered = filtered.filter(m => m.animalType === filters.animalType);
        if (filters.riskLevel) filtered = filtered.filter(m => m.riskLevel === filters.riskLevel);
        resolve(filtered);
      }, 500);
    });
  },

  getHotspots: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(hotspots), 500));
  },

  getAreaDetailsById: async (id) => {
    return new Promise((resolve) => setTimeout(() => resolve(getAreaDetails(id)), 500));
  }
};
