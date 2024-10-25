// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-gray-200' : '';
  };

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <nav className="mt-5">
        <Link
          to="/venta/nueva"
          className={`block px-4 py-2 hover:bg-gray-100 ${isActive('/venta/nueva')}`}
        >
          Nueva Venta
        </Link>
        <Link
          to="/venta/lista"
          className={`block px-4 py-2 hover:bg-gray-100 ${isActive('/venta/lista')}`}
        >
          Lista de Ventas
        </Link>
        <Link
          to="/inventario/productos"
          className={`block px-4 py-2 hover:bg-gray-100 ${isActive('/inventario')}`}
        >
          Inventario
        </Link>
        <Link
          to="/clientes"
          className={`block px-4 py-2 hover:bg-gray-100 ${isActive('/clientes')}`}
        >
          Clientes
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
