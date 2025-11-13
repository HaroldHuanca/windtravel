import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { storage } from './utils/storage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Clientes from './pages/Clientes';
import Empleados from './pages/Empleados';
import Proveedores from './pages/Proveedores';
import Paquetes from './pages/Paquetes';
import Reservas from './pages/Reservas';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = storage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/usuarios" element={isAuthenticated ? <Usuarios /> : <Navigate to="/login" />} />
        <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Navigate to="/login" />} />
        <Route path="/empleados" element={isAuthenticated ? <Empleados /> : <Navigate to="/login" />} />
        <Route path="/proveedores" element={isAuthenticated ? <Proveedores /> : <Navigate to="/login" />} />
        <Route path="/paquetes" element={isAuthenticated ? <Paquetes /> : <Navigate to="/login" />} />
        <Route path="/reservas" element={isAuthenticated ? <Reservas /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
