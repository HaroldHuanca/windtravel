import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { storage } from '../utils/storage';

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const usuario = JSON.parse(storage.getItem('usuario') || '{}');

  const handleLogout = () => {
    storage.removeItem('token');
    storage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2 font-bold text-xl">
            <span>✈️</span>
            <span>TravelCRM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-blue-700 transition">Dashboard</Link>
            <Link to="/usuarios" className="px-3 py-2 rounded hover:bg-blue-700 transition">Usuarios</Link>
            <Link to="/clientes" className="px-3 py-2 rounded hover:bg-blue-700 transition">Clientes</Link>
            <Link to="/empleados" className="px-3 py-2 rounded hover:bg-blue-700 transition">Empleados</Link>
            <Link to="/proveedores" className="px-3 py-2 rounded hover:bg-blue-700 transition">Proveedores</Link>
            <Link to="/paquetes" className="px-3 py-2 rounded hover:bg-blue-700 transition">Paquetes</Link>
            <Link to="/reservas" className="px-3 py-2 rounded hover:bg-blue-700 transition">Reservas</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">{usuario.nombre}</span>
            <button onClick={handleLogout} className="flex items-center space-x-1 bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition">
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/dashboard" className="block px-3 py-2 rounded hover:bg-blue-700">Dashboard</Link>
            <Link to="/usuarios" className="block px-3 py-2 rounded hover:bg-blue-700">Usuarios</Link>
            <Link to="/clientes" className="block px-3 py-2 rounded hover:bg-blue-700">Clientes</Link>
            <Link to="/empleados" className="block px-3 py-2 rounded hover:bg-blue-700">Empleados</Link>
            <Link to="/proveedores" className="block px-3 py-2 rounded hover:bg-blue-700">Proveedores</Link>
            <Link to="/paquetes" className="block px-3 py-2 rounded hover:bg-blue-700">Paquetes</Link>
            <Link to="/reservas" className="block px-3 py-2 rounded hover:bg-blue-700">Reservas</Link>
            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-1 bg-red-600 px-3 py-2 rounded hover:bg-red-700">
              <LogOut size={18} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
