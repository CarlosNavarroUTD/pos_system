// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import PrivateRoute from './services/auth/PrivateRoute';

// Admin Pages
import Dashboard from './pages/admin/dashboard/Dashboard';
import ListaVentas from './pages/admin/ventas/ListaVentas';
import NuevaVenta from './pages/admin/ventas/NuevaVenta';
import ListaProductos from './pages/admin/inventario/ListaProductos';
import ListaClientes from './pages/admin/clientes/ListaClientes';

// Public Pages
import LoginScreen from './pages/public/auth/LoginScreen';
import HomePage from './pages/public/website/HomePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginScreen />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ventas">
              <Route index element={<ListaVentas />} />
              <Route path="nueva" element={<NuevaVenta />} />
            </Route>
            <Route path="inventario" element={<ListaProductos />} />
            <Route path="clientes" element={<ListaClientes />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;