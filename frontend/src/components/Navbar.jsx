import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth/AuthContext';

const Navbar = ({ isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                AxolPOS
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAdmin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/ventas"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Ventas
                </Link>
                <Link
                  to="/admin/inventario"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Inventario
                </Link>
                <Link
                  to="/admin/clientes"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Clientes
                </Link>
              </>
            ) : null}
            
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/ventas"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Ventas
                </Link>
                <Link
                  to="/admin/inventario"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Inventario
                </Link>
                <Link
                  to="/admin/clientes"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Clientes
                </Link>
              </>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;