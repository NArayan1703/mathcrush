import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

// Use VITE_API_BASE_URL if configured (e.g. Render.com API), fallback to relative /api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('math_crush_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error: any) => {
  return Promise.reject(error);
});

export default api;
