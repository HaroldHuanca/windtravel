import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';

function Paquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    destino: '',
    duracion_dias: '',
    precio_base: '',
    precio_actual: '',
    capacidad_maxima: '',
    disponibles: '',
    fecha_inicio: '',
    fecha_fin: '',
    incluye_transporte: false,
    incluye_alojamiento: false,
    incluye_comidas: false,
    incluye_tours: false,
    nivel_dificultad: '',
    tipo_paquete: '',
    proveedor_id: '',
    activo: true,
  });

  useEffect(() => {
    fetchPaquetes();
  }, []);

  const fetchPaquetes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/paquetes');
      setPaquetes(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar paquetes');
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
        await api.put(`/paquetes/${editingId}`, formData);
      } else {
        await api.post('/paquetes', formData);
      }
      fetchPaquetes();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        nombre: '',
        descripcion: '',
        destino: '',
        duracion_dias: '',
        precio_base: '',
        precio_actual: '',
        capacidad_maxima: '',
        disponibles: '',
        fecha_inicio: '',
        fecha_fin: '',
        incluye_transporte: false,
        incluye_alojamiento: false,
        incluye_comidas: false,
        incluye_tours: false,
        nivel_dificultad: '',
        tipo_paquete: '',
        proveedor_id: '',
        activo: true,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar paquete');
    }
  };

  const handleEdit = (paquete) => {
    setFormData(paquete);
    setEditingId(paquete.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/paquetes/${id}`);
        fetchPaquetes();
      } catch (err) {
        setError('Error al eliminar paquete');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      descripcion: '',
      destino: '',
      duracion_dias: '',
      precio_base: '',
      precio_actual: '',
      capacidad_maxima: '',
      disponibles: '',
      fecha_inicio: '',
      fecha_fin: '',
      incluye_transporte: false,
      incluye_alojamiento: false,
      incluye_comidas: false,
      incluye_tours: false,
      nivel_dificultad: '',
      tipo_paquete: '',
      proveedor_id: '',
      activo: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Paquetes Turísticos</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
          >
            <Plus size={20} />
            <span>Nuevo Paquete</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-start space-x-2">
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Paquete' : 'Nuevo Paquete'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="text" name="destino" placeholder="Destino" value={formData.destino} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="number" name="duracion_dias" placeholder="Duración (días)" value={formData.duracion_dias} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="number" name="precio_base" placeholder="Precio Base" value={formData.precio_base} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="number" name="precio_actual" placeholder="Precio Actual" value={formData.precio_actual} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="number" name="capacidad_maxima" placeholder="Capacidad Máxima" value={formData.capacidad_maxima} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="number" name="disponibles" placeholder="Disponibles" value={formData.disponibles} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" required />
                <input type="text" name="nivel_dificultad" placeholder="Nivel de Dificultad" value={formData.nivel_dificultad} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                <input type="text" name="tipo_paquete" placeholder="Tipo de Paquete" value={formData.tipo_paquete} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                <input type="number" name="proveedor_id" placeholder="ID Proveedor" value={formData.proveedor_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
              </div>
              <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" rows="2"></textarea>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <label className="flex items-center space-x-2"><input type="checkbox" name="incluye_transporte" checked={formData.incluye_transporte} onChange={handleChange} className="w-4 h-4" /><span className="text-sm">Transporte</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="incluye_alojamiento" checked={formData.incluye_alojamiento} onChange={handleChange} className="w-4 h-4" /><span className="text-sm">Alojamiento</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="incluye_comidas" checked={formData.incluye_comidas} onChange={handleChange} className="w-4 h-4" /><span className="text-sm">Comidas</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="incluye_tours" checked={formData.incluye_tours} onChange={handleChange} className="w-4 h-4" /><span className="text-sm">Tours</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} className="w-4 h-4" /><span className="text-sm">Activo</span></label>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Destino</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Disponibles</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paquetes.map((paquete) => (
                  <tr key={paquete.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{paquete.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paquete.destino}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${paquete.precio_actual}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paquete.disponibles}/{paquete.capacidad_maxima}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEdit(paquete)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(paquete.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default Paquetes;
