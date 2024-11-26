// src/services/api/productosApi.js
import axios from './config';
import { endpoints } from './config';

export const productosAPI = {
  listar: async (busqueda = '') => {
    try {
      const params = busqueda ? { q: busqueda } : {};
      const { data } = await axios.get(endpoints.productos, { params });
      return data;
    } catch (error) {
      console.error('Error al listar productos:', error);
      throw error;
    }
  },

  crear: async (productoData) => {
    try {
      const { data } = await axios.post(endpoints.productos, productoData);
      return data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  actualizar: async (id, productoData) => {
    try {
      const { data } = await axios.put(endpoints.producto(id), productoData);
      return data;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      const { data } = await axios.delete(endpoints.producto(id));
      return data;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },
};
