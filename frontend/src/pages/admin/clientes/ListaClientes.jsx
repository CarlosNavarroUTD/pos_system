// frontend/src/components/clientes/ListaClientes.jsx
import React, { useState, useEffect } from 'react';
import { clientesAPI } from '../../../services/api/clientesApi';


const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const cargarClientes = async () => {
    try {
      const data = await clientesAPI.listar(busqueda);
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (clienteEditando) {
        await clientesAPI.actualizar(clienteEditando.id_cliente, formData);
      } else {
        await clientesAPI.crear(formData);
      }
      setModalAbierto(false);
      cargarClientes();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    try {
      await clientesAPI.eliminar(id);
      cargarClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  const editarCliente = (cliente) => {
    setClienteEditando(cliente);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    });
    setModalAbierto(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setClienteEditando(null);
  };

  useEffect(() => {
    cargarClientes();
  }, [busqueda]);

  if (loading) return <div className="text-center p-4">Cargando clientes...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Clientes</h1>
        <button
          onClick={() => {
            resetForm();
            setModalAbierto(true);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar clientes..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Dirección</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id_cliente} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {cliente.nombre} {cliente.apellido}
                </td>
                <td className="px-4 py-2">{cliente.email}</td>
                <td className="px-4 py-2">{cliente.telefono}</td>
                <td className="px-4 py-2">{cliente.direccion}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => editarCliente(cliente)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarCliente(cliente.id_cliente)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientes.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No se encontraron clientes
          </div>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaClientes;