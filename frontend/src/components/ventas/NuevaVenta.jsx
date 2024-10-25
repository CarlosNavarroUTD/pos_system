// src/components/ventas/NuevaVenta.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NuevaVenta = () => {
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [productosEncontrados, setProductosEncontrados] = useState([]);
  const [clientesEncontrados, setClientesEncontrados] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productos, setProductos] = useState({}); // Almacenar información de productos
  
  const navigate = useNavigate();

  // Función para buscar productos
  const buscarProductos = async (termino) => {
    if (!termino) {
      setProductosEncontrados([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Cambiamos la URL para usar el parámetro 'buscar' en lugar de 'q'
      const response = await fetch(`http://localhost:8000/api/inventario/productos/?buscar=${termino}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProductosEncontrados(data);
    } catch (error) {
      console.error('Error al buscar productos:', error);
      setError('Error al buscar productos');
    }
  };

  // Función para buscar clientes
  const buscarClientes = async (termino) => {
    if (!termino) {
      setClientesEncontrados([]);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/ventas/clientes/?buscar=${termino}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setClientesEncontrados(data);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      setError('Error al buscar clientes');
    }
  };

  // Función para agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const productoEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);
    
    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad + 1 > producto.stock) {
        setError('No hay suficiente stock disponible');
        return;
      }
      
      setCarrito(carrito.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      if (producto.stock < 1) {
        setError('No hay stock disponible');
        return;
      }
      
      setCarrito([...carrito, {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      }]);
    }
    setBusquedaProducto('');
    setProductosEncontrados([]);
  };

  // Función para actualizar cantidad en el carrito
  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    const producto = productosEncontrados.find(p => p.id_producto === id_producto);
    
    if (nuevaCantidad > producto.stock) {
      setError('No hay suficiente stock disponible');
      return;
    }
    
    if (nuevaCantidad < 1) {
      setCarrito(carrito.filter(item => item.id_producto !== id_producto));
    } else {
      setCarrito(carrito.map(item =>
        item.id_producto === id_producto
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    }
  };

  // Función para calcular el total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  // Función para procesar la venta
  const procesarVenta = async () => {
    if (carrito.length === 0) {
      setError('El carrito está vacío');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
  
      const venta = {
        id_cliente: cliente?.id_cliente || null,
        metodo_pago: metodoPago,
        fecha: new Date().toISOString().split('T')[0],
        total: calcularTotal(),
        detalles: carrito.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          subtotal: item.precio * item.cantidad
        }))
      };
  
      console.log('Enviando datos:', venta); // Debug
  
      const response = await fetch('http://localhost:8000/api/ventas/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // Si estás usando CSRF, asegúrate de incluirlo aquí
          // 'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: 'include', // Importante si estás usando CSRF
        body: JSON.stringify(venta)
      });
  
      console.log('Status:', response.status); // Debug
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('Respuesta no JSON:', text); // Debug
        throw new Error('Respuesta no válida del servidor');
      }
  
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Error al procesar la venta');
      }
  
      // Limpiar el formulario después de una venta exitosa
      setCarrito([]);
      setCliente(null);
      setBusquedaCliente('');
      setMetodoPago('efectivo');
      setError(null);
  
      // Redirigir al detalle de la venta
      navigate(`/venta/detalle/${data.id_venta}`);
    } catch (error) {
      console.error('Error detallado:', error);
      setError(error.message || 'Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };
  

  // Efectos para las búsquedas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarProductos(busquedaProducto);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busquedaProducto]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarClientes(busquedaCliente);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [busquedaCliente]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel izquierdo: Búsqueda y carrito */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Búsqueda de Productos</h2>
            <input
              type="text"
              value={busquedaProducto}
              onChange={(e) => setBusquedaProducto(e.target.value)}
              placeholder="Buscar producto por nombre o código"
              className="w-full p-2 border rounded"
            />
            {productosEncontrados.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto">
                {productosEncontrados.map(producto => (
                  <div
                    key={producto.id_producto}
                    onClick={() => agregarAlCarrito(producto)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{producto.nombre}</div>
                    <div className="text-sm text-gray-600">
                      Stock: {producto.stock} - Precio: ${producto.precio}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Carrito</h2>
            {carrito.length === 0 ? (
              <p className="text-gray-500">No hay productos en el carrito</p>
            ) : (
              <div className="space-y-2">
                {carrito.map(item => (
                  <div key={item.id_producto} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-gray-600">
                        ${item.precio} x {item.cantidad} = ${(item.precio * item.cantidad).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho: Cliente y finalización */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Selección de Cliente</h2>
            <input
              type="text"
              value={busquedaCliente}
              onChange={(e) => setBusquedaCliente(e.target.value)}
              placeholder="Buscar cliente por nombre o email"
              className="w-full p-2 border rounded"
            />
            {clientesEncontrados.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto">
                {clientesEncontrados.map(clienteEncontrado => (
                  <div
                    key={clienteEncontrado.id_cliente}
                    onClick={() => setCliente(clienteEncontrado)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">
                      {clienteEncontrado.nombre} {clienteEncontrado.apellido}
                    </div>
                    <div className="text-sm text-gray-600">{clienteEncontrado.email}</div>
                  </div>
                ))}
              </div>
            )}
            {cliente && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <div className="font-medium">Cliente seleccionado:</div>
                <div>{cliente.nombre} {cliente.apellido}</div>
                <button
                  onClick={() => setCliente(null)}
                  className="text-red-500 text-sm"
                >
                  Cambiar cliente
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Finalizar Venta</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Método de Pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={procesarVenta}
                disabled={loading || carrito.length === 0}
                className={`w-full py-2 px-4 rounded text-white ${
                  loading || carrito.length === 0
                    ? 'bg-gray-400'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Procesando...' : 'Procesar Venta'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVenta;