import axios from 'axios';
import { authService } from './authService';
import { formatDateForAPI } from '../utils/dateUtils';

const API_BASE_URL = 'http://localhost:8088/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        const token = authService.getAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        // If refresh token fails, redirect to login
        authService.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export const getGasSensorLogs = async (limit = 50, cursor, from = null, to = null) => {
  try {
    let url = `/gas-sensor/logs?limit=${limit}`;
    if (cursor !== undefined && cursor !== null) {
      url += `&cursor=${cursor}`;
    }
    if (from) {
      url += `&from=${encodeURIComponent(formatDateForAPI(from))}`;
    }
    if (to) {
      url += `&to=${encodeURIComponent(formatDateForAPI(to))}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching gas sensor logs:', error);
    throw error;
  }
};

export const getGasSensorTopLogs = async () => {
  try {
    const response = await api.get('/gas-sensor/logs/top');
    return response.data;
  } catch (error) {
    console.error('Error fetching top gas sensor logs:', error);
    throw error;
  }
};

export const getTemperatureSensorLogs = async (limit = 50, cursor, from = null, to = null) => {
  try {
    let url = `/temperature-sensor/logs?limit=${limit}`;
    if (cursor !== undefined && cursor !== null) {
      url += `&cursor=${cursor}`;
    }
    if (from) {
      url += `&from=${encodeURIComponent(formatDateForAPI(from))}`;
    }
    if (to) {
      url += `&to=${encodeURIComponent(formatDateForAPI(to))}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature sensor logs:', error);
    throw error;
  }
};

export const getTemperatureSensorTopLogs = async () => {
  try {
    const response = await api.get('/temperature-sensor/logs/top');
    return response.data;
  } catch (error) {
    console.error('Error fetching top temperature sensor logs:', error);
    throw error;
  }
};

export { api }; 