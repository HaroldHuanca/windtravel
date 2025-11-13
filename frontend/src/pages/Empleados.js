import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    usuario_id: '',
    numero_empleado: '',
    departamento: '',
    puesto: '',
    salario: '',
    fecha_contratacion: '',
    fecha_terminacion: '',
    activo: true,
  });

  useEffect(() => {
    fetchEmpleados();
    fetchUsuarios();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empleados');
      setEmpleados(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/empleados/${editingId}`, formData);
      } else {
        await api.post('/empleados', formData);
      }
      fetchEmpleados();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        usuario_id: '',
        numero_empleado: '',
        departamento: '',
        puesto: '',
        salario: '',
        fecha_contratacion: '',
        fecha_terminacion: '',
        activo: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar empleado');
    }
  };

  const handleEdit = (empleado) => {
    setFormData(empleado);
    setEditingId(empleado.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/empleados/${id}`);
        fetchEmpleados();
      } catch (err) {
        setError('Error al eliminar empleado');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      usuario_id: '',
      numero_empleado: '',
      departamento: '',
      puesto: '',
      salario: '',
      fecha_contratacion: '',
      fecha_terminacion: '',
      activo: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <Plus size={20} />
            <span>Nuevo Empleado</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-start space-x-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="usuario_id" value={formData.usuario_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required>
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellido} ({usuario.email})
                    </option>
                  ))}
                </select>
                <input type="text" name="numero_empleado" placeholder="Número de Empleado" value={formData.numero_empleado} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
                <input type="text" name="departamento" placeholder="Departamento" value={formData.departamento} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
                <input type="text" name="puesto" placeholder="Puesto" value={formData.puesto} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
                <input type="number" name="salario" placeholder="Salario" value={formData.salario} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
                <input type="date" name="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" required />
                <input type="date" name="fecha_terminacion" value={formData.fecha_terminacion} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="w-4 h-4" />
                <label className="text-gray-700">Activo</label>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  <Check size={20} />
                  <span>Guardar</span>
                </button>
                <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Número</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Departamento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Puesto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado) => (
                  <tr key={empleado.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{empleado.nombre} {empleado.apellido}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.numero_empleado}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.departamento}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{empleado.puesto}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${empleado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {empleado.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEdit(empleado)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(empleado.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Empleados;
