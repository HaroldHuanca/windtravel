import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_proveedor: '',
    contacto_nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    codigo_postal: '',
    sitio_web: '',
    calificacion: '',
    activo: true,
  });

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proveedores');
      setProveedores(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
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
        await api.put(`/proveedores/${editingId}`, formData);
      } else {
        await api.post('/proveedores', formData);
      }
      fetchProveedores();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        nombre: '',
        tipo_proveedor: '',
        contacto_nombre: '',
        contacto_email: '',
        contacto_telefono: '',
        direccion: '',
        ciudad: '',
        pais: '',
        codigo_postal: '',
        sitio_web: '',
        calificacion: '',
        activo: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar proveedor');
    }
  };

  const handleEdit = (proveedor) => {
    setFormData(proveedor);
    setEditingId(proveedor.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/proveedores/${id}`);
        fetchProveedores();
      } catch (err) {
        setError('Error al eliminar proveedor');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      tipo_proveedor: '',
      contacto_nombre: '',
      contacto_email: '',
      contacto_telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      codigo_postal: '',
      sitio_web: '',
      calificacion: '',
      activo: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Proveedores</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            <Plus size={20} />
            <span>Nuevo Proveedor</span>
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
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required />
                <input type="text" name="tipo_proveedor" placeholder="Tipo de Proveedor" value={formData.tipo_proveedor} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" required />
                <input type="text" name="contacto_nombre" placeholder="Contacto" value={formData.contacto_nombre} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="email" name="contacto_email" placeholder="Email" value={formData.contacto_email} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="tel" name="contacto_telefono" placeholder="Teléfono" value={formData.contacto_telefono} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="text" name="pais" placeholder="País" value={formData.pais} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="text" name="codigo_postal" placeholder="Código Postal" value={formData.codigo_postal} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="url" name="sitio_web" placeholder="Sitio Web" value={formData.sitio_web} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
                <input type="number" name="calificacion" placeholder="Calificación (0-5)" value={formData.calificacion} onChange={handleChange} min="0" max="5" step="0.1" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600" />
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contacto</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Calificación</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.map((proveedor) => (
                  <tr key={proveedor.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{proveedor.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{proveedor.tipo_proveedor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{proveedor.contacto_nombre || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">⭐ {proveedor.calificacion || '-'}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEdit(proveedor)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(proveedor.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default Proveedores;
