import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    ventasHoy: 0,
    ventasSemana: 0,
    productosPocoStock: 0,
    totalClientes: 0
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Obtener ventas recientes
        const ventasResponse = await fetch('http://localhost:8000/api/ventas/', {
          headers
        });
        const ventasData = await ventasResponse.json();

        // Obtener productos con bajo stock
        const productosResponse = await fetch('http://localhost:8000/api/inventario/productos/', {
          headers
        });
        const productosData = await productosResponse.json();

        // Calcular estadísticas
        const hoy = new Date().toISOString().split('T')[0];
        const unaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const ventasHoy = ventasData.filter(venta => 
          venta.fecha_venta.startsWith(hoy)
        ).reduce((sum, venta) => sum + venta.total, 0);

        const ventasSemana = ventasData.filter(venta => 
          venta.fecha_venta >= unaSemanaAtras && venta.fecha_venta <= hoy
        ).reduce((sum, venta) => sum + venta.total, 0);

        const productosPocoStock = productosData.filter(producto => 
          producto.stock < producto.stock_minimo
        ).length;

        setStats({
          ventasHoy,
          ventasSemana,
          productosPocoStock,
          totalClientes: ventasData.reduce((unique, venta) => 
            unique.add(venta.id_cliente), new Set()).size
        });

        // Preparar datos para el gráfico
        const ventasOrdenadas = ventasData
          .sort((a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta))
          .slice(0, 30)
          .map(venta => ({
            fecha: venta.fecha_venta.split('T')[0],
            total: venta.total,
            id: venta.id_venta
          }))
          .reverse();

        setVentasRecientes(ventasOrdenadas);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.ventasHoy.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Semanales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.ventasSemana.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Bajo Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productosPocoStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de ventas */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ventas Últimos 30 Días</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventasRecientes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`$${value.toFixed(2)}`, "Venta"]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lista de últimas ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ventasRecientes.slice(-5).map((venta) => (
              <div key={venta.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <div className="font-medium">Venta #{venta.id}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(venta.fecha).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-semibold">${venta.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;