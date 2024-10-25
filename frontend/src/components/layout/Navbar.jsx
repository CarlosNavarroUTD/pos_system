// src/components/layout/Navbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Mi Punto de Venta</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
