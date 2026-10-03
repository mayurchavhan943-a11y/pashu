import { diseaseHistorySummary, diseaseTrendsData, emergingDiseaseTrends } from '../data/diseaseTrends';
import { currentRiskFactors } from '../data/riskFactors';

export const riskAnalysisService = {
  getDiseaseHistorySummary: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(diseaseHistorySummary), 500));
  },

  getDiseaseTrends: async (timeframe = '7days') => {
    return new Promise((resolve) => setTimeout(() => resolve(diseaseTrendsData), 500));
  },

  getEmergingTrends: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(emergingDiseaseTrends), 500));
  },

  getRiskFactors: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(currentRiskFactors), 500));
  },

  calculateRiskScore: async (factors) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let total = 0;
        Object.values(factors).forEach(f => { total += f.score || 0 });
        const maxScore = 100;
        const score = Math.min(total, maxScore);
        
        let level = 'LOW';
        if (score > 30 && score <= 60) level = 'MEDIUM';
        else if (score > 60) level = 'HIGH';

        resolve({
          score,
          level,
          factors: Object.values(factors)
        });
      }, 500);
    });
  }
};
