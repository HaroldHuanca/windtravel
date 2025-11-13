import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    usuario_id: '',
    documento_identidad: '',
    tipo_documento: 'CC',
    fecha_nacimiento: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigo_postal: '',
    preferencias: '',
  });

  useEffect(() => {
    fetchClientes();
    fetchUsuarios();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clientes');
      setClientes(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar clientes');
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/clientes/${editingId}`, formData);
      } else {
        await api.post('/clientes', formData);
      }
      fetchClientes();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        usuario_id: '',
        documento_identidad: '',
        tipo_documento: 'CC',
        fecha_nacimiento: '',
        direccion: '',
        ciudad: '',
        pais: '',
        codigo_postal: '',
        preferencias: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setEditingId(cliente.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/clientes/${id}`);
        fetchClientes();
      } catch (err) {
        setError('Error al eliminar cliente');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      usuario_id: '',
      documento_identidad: '',
      tipo_documento: 'CC',
      fecha_nacimiento: '',
      direccion: '',
      ciudad: '',
      pais: '',
      codigo_postal: '',
      preferencias: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <Plus size={20} />
            <span>Nuevo Cliente</span>
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
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="usuario_id" value={formData.usuario_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required>
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellido} ({usuario.email})
                    </option>
                  ))}
                </select>
                <input type="text" name="documento_identidad" placeholder="Documento" value={formData.documento_identidad} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" required />
                <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600">
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="PA">PA</option>
                </select>
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
                <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
                <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
                <input type="text" name="pais" placeholder="País" value={formData.pais} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
                <input type="text" name="codigo_postal" placeholder="Código Postal" value={formData.codigo_postal} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" />
              </div>
              <textarea name="preferencias" placeholder="Preferencias" value={formData.preferencias} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600" rows="3"></textarea>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Documento</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ciudad</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{cliente.nombre} {cliente.apellido}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.documento_identidad}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cliente.ciudad || '-'}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEdit(cliente)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(cliente.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default Clientes;
