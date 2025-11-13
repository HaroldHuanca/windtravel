import React from 'react';
import Navbar from '../components/Navbar';
import { storage } from '../utils/storage';
import { Users, Briefcase, User, Package, Calendar, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const usuario = JSON.parse(storage.getItem('usuario') || '{}');

  const modules = [
    { icon: Users, label: 'Usuarios', path: '/usuarios', color: 'bg-blue-500' },
    { icon: User, label: 'Clientes', path: '/clientes', color: 'bg-green-500' },
    { icon: Briefcase, label: 'Empleados', path: '/empleados', color: 'bg-purple-500' },
    { icon: Building2, label: 'Proveedores', path: '/proveedores', color: 'bg-orange-500' },
    { icon: Package, label: 'Paquetes', path: '/paquetes', color: 'bg-pink-500' },
    { icon: Calendar, label: 'Reservas', path: '/reservas', color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Bienvenido, {usuario.nombre}! 👋</h1>
          <p className="text-gray-600">Sistema de Gestión de Paquetes Turísticos - TravelCRM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.path}
                to={module.path}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer group"
              >
                <div className={`${module.color} text-white p-4 rounded-lg w-fit mb-4 group-hover:scale-110 transition`}>
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{module.label}</h3>
                <p className="text-gray-600 text-sm">Gestionar {module.label.toLowerCase()}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">ℹ️ Información del Sistema</h2>
          <ul className="space-y-2 text-blue-800">
            <li>✓ Gestión completa de usuarios, clientes y empleados</li>
            <li>✓ Administración de proveedores y paquetes turísticos</li>
            <li>✓ Sistema de reservas con seguimiento de estado</li>
            <li>✓ Autenticación segura con JWT</li>
            <li>✓ Base de datos PostgreSQL integrada</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
