import api from './api';

export const diseaseService = {
  getAllDiseases: async () => {
    const response = await api.get('/diseases');
    return response.data;
  },
  
  getDiseaseById: async (id) => {
    const response = await api.get(`/diseases/${id}`);
    return response.data;
  },
  
  createDisease: async (diseaseData) => {
    const response = await api.post('/diseases', diseaseData);
    return response.data;
  },
  
  updateDisease: async (id, diseaseData) => {
    const response = await api.put(`/diseases/${id}`, diseaseData);
    return response.data;
  },
  
  deleteDisease: async (id) => {
    const response = await api.delete(`/diseases/${id}`);
    return response.data;
  }
};
