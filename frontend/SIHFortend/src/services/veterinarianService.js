import api from './api';

export const veterinarianService = {
  getAllVeterinarians: async () => {
    const response = await api.get('/veterinarians');
    return response.data;
  },
  
  getVeterinarianById: async (id) => {
    const response = await api.get(`/veterinarians/${id}`);
    return response.data;
  },
  
  createVeterinarian: async (vetData) => {
    const response = await api.post('/veterinarians', vetData);
    return response.data;
  },
  
  updateVeterinarian: async (id, vetData) => {
    const response = await api.put(`/veterinarians/${id}`, vetData);
    return response.data;
  },
  
  deleteVeterinarian: async (id) => {
    const response = await api.delete(`/veterinarians/${id}`);
    return response.data;
  }
};
