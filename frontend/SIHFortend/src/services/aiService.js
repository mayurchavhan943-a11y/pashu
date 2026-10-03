import api from './api';

export const aiPredictionService = {
  predictHealth: async (healthData) => {
    const response = await api.post('/ai/predict', healthData);
    return response.data;
  }
};
