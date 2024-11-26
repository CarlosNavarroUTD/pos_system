// src/services/api/config.js
import axios from 'axios';
import TokenService from '../auth/tokenService';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const endpoints = {
  auth: {
    login: '/api/token/',
    refresh: '/api/token/refresh/',
    me: '/api/usuarios/me/',
    logout: '/api/auth/logout/'
  },
  clientes: '/api/clientes/',
  cliente: (id) => `/api/clientes/${id}/`,
  ventas: '/api/ventas/',
  venta: (id) => `/api/ventas/${id}/`,
  productos: '/api/inventario/productos/',
  producto: (id) => `/api/inventario/productos/${id}/`
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Control de refrescado de token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor para las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await TokenService.refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenService.removeTokens();
        // Podrías agregar aquí una redirección al login si lo deseas
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;