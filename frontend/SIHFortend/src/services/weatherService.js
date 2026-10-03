import { currentWeather, weatherHistory } from '../data/weatherData';

export const weatherService = {
  getCurrentWeather: async (location = 'Pune') => {
    return new Promise((resolve) => setTimeout(() => resolve(currentWeather), 500));
  },
  
  getWeatherHistory: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(weatherHistory), 500));
  }
};
