import { api } from './api';

export const configLimitService = {
  getAllConfigs: async () => {
    try {
      const response = await api.get('/config-limit/get');
      return response.data;
    } catch (error) {
      console.error('Error fetching all configs:', error);
      throw error;
    }
  },

  getConfigByDevice: async (deviceId) => {
    try {
      const response = await api.get(`/config-limit/get-by-device?device_id=${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching config by device:', error);
      throw error;
    }
  },

  updateConfig: async (config) => {
    try {
      const response = await api.post('/config-limit/save', config);
      return response.data;
    } catch (error) {
      console.error('Error updating config:', error);
      throw error;
    }
  }
}; 