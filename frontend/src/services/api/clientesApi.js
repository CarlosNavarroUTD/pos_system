// src/services/api/clientesApi.js
import axios from './config';
import { endpoints } from './config';

export const clientesAPI = {
  listar: async (busqueda = '') => {
    const params = busqueda ? { q: busqueda } : {};
    const { data } = await axios.get(endpoints.clientes, { params });
    return data;
  },
  crear: async (clienteData) => {
    const { data } = await axios.post(endpoints.clientes, clienteData);
    return data;
  },
  actualizar: async (id, clienteData) => {
    const { data } = await axios.put(endpoints.cliente(id), clienteData);
    return data;
  },
  eliminar: async (id) => {
    const { data } = await axios.delete(endpoints.cliente(id));
    return data;
  },
};