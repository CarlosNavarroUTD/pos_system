import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListaProductos = () => {
  // Estados para el manejo de productos
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para el modal y edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    codigo: ''
  });

  const navigate = useNavigate();

  // Función para verificar autenticación
  const verificarAutenticacion = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  // Función para cargar productos
  const cargarProductos = async () => {
    const token = verificarAutenticacion();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      let url = 'http://localhost:8000/api/inventario/productos/';
      if (busqueda) {
        url += `?q=${busqueda}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }

      const data = await response.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el guardado de productos
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = verificarAutenticacion();
    if (!token) return;
    
    try {
      setError(null);
      const url = productoEditando 
        ? `http://localhost:8000/api/inventario/productos/${productoEditando.id_producto}/`
        : 'http://localhost:8000/api/inventario/productos/';
        
      const method = productoEditando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error(productoEditando ? 'Error al actualizar el producto' : 'Error al crear el producto');
      }

      setModalAbierto(false);
      cargarProductos();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para eliminar productos
  const eliminarProducto = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    const token = verificarAutenticacion();
    if (!token) return;

    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/inventario/productos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para preparar la edición de un producto
  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      codigo: producto.codigo
    });
    setModalAbierto(true);
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      codigo: ''
    });
    setProductoEditando(null);
  };

  // Efecto para cargar productos cuando cambia la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarProductos();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  return (
    <div className="container mx-auto p-4">
      {/* Header con título y botón de nuevo producto */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventario de Productos</h1>
        <button
          onClick={() => {
            resetForm();
            setModalAbierto(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nuevo Producto
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full p-2 border rounded shadow-sm"
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Estado de carga */}
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando productos...</p>
        </div>
      ) : (
        /* Tabla de productos */
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((producto) => (
                <tr key={producto.id_producto} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{producto.codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                  <td className="px-6 py-4">{producto.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${producto.precio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{producto.stock}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => editarProducto(producto)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(producto.id_producto)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>
      )}

      {/* Modal de producto */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">
              {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  className="w-full p-2 border rounded shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full p-2 border rounded shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full p-2 border rounded shadow-sm"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  className="w-full p-2 border rounded shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full p-2 border rounded shadow-sm"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
                >
                  {productoEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaProductos;