import api from './api';

export const healthRecordService = {
  getRecordById: async (id) => {
    const response = await api.get(`/health-records/${id}`);
    return response.data;
  },
  
  getRecordsByAnimalId: async (animalId) => {
    const response = await api.get(`/health-records/animal/${animalId}`);
    return response.data;
  },
  
  createRecord: async (recordData) => {
    const response = await api.post('/health-records', recordData);
    return response.data;
  },
  
  updateRecord: async (id, recordData) => {
    const response = await api.put(`/health-records/${id}`, recordData);
    return response.data;
  },
  
  deleteRecord: async (id) => {
    const response = await api.delete(`/health-records/${id}`);
    return response.data;
  }
};
