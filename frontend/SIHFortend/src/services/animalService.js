import api from './api';

export const animalService = {
  getAllAnimals: async () => {
    const response = await api.get('/animals');
    return response.data;
  },
  
  getAnimalById: async (id) => {
    const response = await api.get(`/animals/${id}`);
    return response.data;
  },
  
  createAnimal: async (animalData) => {
    const response = await api.post('/animals', animalData);
    return response.data;
  },
  
  updateAnimal: async (id, animalData) => {
    const response = await api.put(`/animals/${id}`, animalData);
    return response.data;
  },
  
  deleteAnimal: async (id) => {
    const response = await api.delete(`/animals/${id}`);
    return response.data;
  }
};
