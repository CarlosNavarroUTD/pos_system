import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroFecha, setFiltroFecha] = useState('');

  const cargarVentas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      let url = 'http://localhost:8000/api/ventas/';
      if (filtroFecha) {
        url += `?fecha=${filtroFecha}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al cargar las ventas');
      }

      const data = await response.json();
      
      // Validar que data sea un array
      if (!Array.isArray(data)) {
        throw new Error('El formato de datos recibido no es válido');
      }

      // Validar la estructura de cada venta
      const ventasValidadas = data.map(venta => ({
        id_venta: venta.id_venta,
        cliente: {
          nombre: venta.cliente?.nombre || 'Cliente',
          apellido: venta.cliente?.apellido || 'Desconocido'
        },
        fecha_venta: venta.fecha_venta || new Date().toISOString(),
        total: typeof venta.total === 'number' ? venta.total : 0,
        metodo_pago: venta.metodo_pago || 'No especificado'
      }));

      setVentas(ventasValidadas);
      setError(null);
    } catch (err) {
      console.error('Error en cargarVentas:', err);
      setError(err.message || 'Error al cargar las ventas');
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, [filtroFecha]);

  const handleFiltroFechaChange = (e) => {
    setFiltroFecha(e.target.value);
    setLoading(true); // Mostrar loading mientras se actualiza
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Cargando ventas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={cargarVentas}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Ventas</h1>
        <Link
          to="/venta/nueva"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
        >
          Nueva Venta
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="date"
          value={filtroFecha}
          onChange={handleFiltroFechaChange}
          className="border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {filtroFecha && (
          <button
            onClick={() => setFiltroFecha('')}
            className="text-gray-500 hover:text-gray-700"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Cliente</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Método de Pago</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta} className="border-b hover:bg-gray-50 transition duration-150">
                  <td className="px-4 py-2">{venta.id_venta}</td>
                  <td className="px-4 py-2">
                    {`${venta.cliente.nombre} ${venta.cliente.apellido}`.trim()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(venta.fecha_venta).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${venta.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {venta.metodo_pago}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Link
                      to={`/venta/detalle/${venta.id_venta}`}
                      className="text-blue-500 hover:text-blue-700 transition duration-150"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {ventas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron ventas para los criterios seleccionados
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaVentas;