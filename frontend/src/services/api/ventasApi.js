// src/services/api/ventasApi.js
import axios from './config';
import { endpoints } from './config';

export const ventasAPI = {
  listar: async (fecha = '') => {
    const params = fecha ? { fecha } : {};
    const { data } = await axios.get(endpoints.ventas, { params });
    return data;
  },
  crear: async (ventaData) => {
    const { data } = await axios.post(endpoints.ventas, ventaData);
    return data;
  },
};