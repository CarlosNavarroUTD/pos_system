import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      title: 'Ventas',
      path: '/admin/ventas',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subItems: [
        {
          title: 'Lista de Ventas',
          path: '/admin/ventas'
        },
        {
          title: 'Nueva Venta',
          path: '/admin/ventas/nueva'
        }
      ]
    },
    {
      title: 'Inventario',
      path: '/admin/inventario',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
    },
    {
      title: 'Clientes',
      path: '/admin/clientes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-700"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-5">
        {menuItems.map((item) => (
          <div key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center px-4 py-3 ${
                location.pathname === item.path ? 'bg-blue-600' : 'hover:bg-gray-700'
              } transition-colors duration-200`}
            >
              <div className="flex items-center">
                {item.icon}
                {isSidebarOpen && (
                  <span className="ml-3">{item.title}</span>
                )}
              </div>
            </Link>
            
            {/* Subitems para el menú de Ventas */}
            {item.subItems && isSidebarOpen && (
              <div className="ml-8 mt-2">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block py-2 px-4 ${
                      location.pathname === subItem.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;