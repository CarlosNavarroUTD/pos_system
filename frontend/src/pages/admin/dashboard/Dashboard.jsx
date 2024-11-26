// src/pages/admin/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { ventasAPI } from '../../../services/api/ventasApi';
import { clientesAPI } from '../../../services/api/clientesApi';
import { productosAPI } from '../../../services/api/productosApi';

const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-semibold mt-2">{value}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    totalClientes: 0,
    productosStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ventas, clientes, productos] = await Promise.all([
          ventasAPI.listar(),
          clientesAPI.listar(),
          productosAPI.listar()
        ]);

        setStats({
          ventasHoy: ventas.length,
          totalClientes: clientes.length,
          productosStock: productos.length
        });
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Ventas de Hoy"
          value={stats.ventasHoy}
          icon={(props) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />

        <DashboardCard
          title="Total Clientes"
          value={stats.totalClientes}
          icon={(props) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        />

        <DashboardCard
          title="Productos en Stock"
          value={stats.productosStock}
          icon={(props) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
        />
      </div>
    </div>
  );
};

export default Dashboard;