// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LogInScreen from './components/auth/LogInScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import NuevaVenta from './components/ventas/NuevaVenta';
import ListaVentas from './components/ventas/ListaVentas';
import ListaProductos from './components/inventario/ListaProductos';
import ListaClientes from './components/clientes/ListaClientes';
import Dashboard from './components/dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LogInScreen />} />
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Rutas anidadas dentro del Layout */}
          <Route index element={<Navigate to="/venta/nueva" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="venta">
            <Route path="nueva" element={<NuevaVenta />} />
            <Route path="lista" element={<ListaVentas />} />
          </Route>
          <Route path="inventario">
            <Route path="productos" element={<ListaProductos />} />
          </Route>
          <Route path="clientes" element={<ListaClientes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
