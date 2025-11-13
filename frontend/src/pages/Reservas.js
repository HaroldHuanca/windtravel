import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { Plus, Edit2, Trash2, AlertCircle, Check } from 'lucide-react';

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    paquete_id: '',
    cantidad_personas: '',
    precio_total: '',
    estado: 'Pendiente',
    fecha_viaje_inicio: '',
    fecha_viaje_fin: '',
    comentarios: '',
    empleado_id: '',
    fecha_confirmacion: '',
    fecha_cancelacion: '',
    razon_cancelacion: '',
  });

  useEffect(() => {
    fetchReservas();
    fetchClientes();
    fetchPaquetes();
    fetchEmpleados();
  }, []);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reservas');
      setReservas(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (err) {
      console.error('Error al cargar clientes:', err);
    }
  };

  const fetchPaquetes = async () => {
    try {
      const response = await api.get('/paquetes');
      setPaquetes(response.data);
    } catch (err) {
      console.error('Error al cargar paquetes:', err);
    }
  };

  const fetchEmpleados = async () => {
    try {
      const response = await api.get('/empleados');
      setEmpleados(response.data);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo ${name} cambió a:`, value);
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar datos con conversión de tipos
      const dataToSend = {
        ...formData,
        cliente_id: parseInt(formData.cliente_id, 10),
        paquete_id: parseInt(formData.paquete_id, 10),
        cantidad_personas: parseInt(formData.cantidad_personas, 10),
        precio_total: parseFloat(formData.precio_total),
        empleado_id: formData.empleado_id ? parseInt(formData.empleado_id, 10) : null,
      };

      console.log('Datos a enviar:', dataToSend);

      if (editingId) {
        await api.put(`/reservas/${editingId}`, dataToSend);
      } else {
        await api.post('/reservas', dataToSend);
      }
      fetchReservas();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        cliente_id: '',
        paquete_id: '',
        cantidad_personas: '',
        precio_total: '',
        estado: 'Pendiente',
        fecha_viaje_inicio: '',
        fecha_viaje_fin: '',
        comentarios: '',
        empleado_id: '',
        fecha_confirmacion: '',
        fecha_cancelacion: '',
        razon_cancelacion: '',
      });
    } catch (err) {
      console.error('Error completo:', err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Error al guardar reserva');
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Si ya está en formato YYYY-MM-DD, devolverlo tal cual
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    // Si es un timestamp o fecha completa, extraer solo la fecha
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const handleEdit = (reserva) => {
    const formattedData = {
      cliente_id: reserva.cliente_id ? String(reserva.cliente_id) : '',
      paquete_id: reserva.paquete_id ? String(reserva.paquete_id) : '',
      cantidad_personas: reserva.cantidad_personas ? String(reserva.cantidad_personas) : '',
      precio_total: reserva.precio_total ? String(reserva.precio_total) : '',
      estado: reserva.estado || 'Pendiente',
      fecha_viaje_inicio: formatDateForInput(reserva.fecha_viaje_inicio),
      fecha_viaje_fin: formatDateForInput(reserva.fecha_viaje_fin),
      comentarios: reserva.comentarios || '',
      empleado_id: reserva.empleado_id ? String(reserva.empleado_id) : '',
      fecha_confirmacion: reserva.fecha_confirmacion || '',
      fecha_cancelacion: reserva.fecha_cancelacion || '',
      razon_cancelacion: reserva.razon_cancelacion || '',
    };
    console.log('Datos formateados para editar:', formattedData);
    console.log('Cliente ID:', formattedData.cliente_id, 'Paquete ID:', formattedData.paquete_id);
    setFormData(formattedData);
    setEditingId(reserva.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro?')) {
      try {
        await api.delete(`/reservas/${id}`);
        fetchReservas();
      } catch (err) {
        setError('Error al eliminar reserva');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      cliente_id: '',
      paquete_id: '',
      cantidad_personas: '',
      precio_total: '',
      estado: 'Pendiente',
      fecha_viaje_inicio: '',
      fecha_viaje_fin: '',
      comentarios: '',
      empleado_id: '',
      fecha_confirmacion: '',
      fecha_cancelacion: '',
      razon_cancelacion: '',
    });
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Confirmada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus size={20} />
            <span>Nueva Reserva</span>
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
            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="cliente_id" value={formData.cliente_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required>
                  <option value="">Seleccionar Cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={String(cliente.id)}>
                      {cliente.nombre} {cliente.apellido} ({cliente.documento_identidad})
                    </option>
                  ))}
                </select>
                <select name="paquete_id" value={formData.paquete_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required>
                  <option value="">Seleccionar Paquete</option>
                  {paquetes.map((paquete) => (
                    <option key={paquete.id} value={String(paquete.id)}>
                      {paquete.nombre} - ${paquete.precio_actual} (ID: {paquete.id})
                    </option>
                  ))}
                </select>
                <input type="number" name="cantidad_personas" placeholder="Cantidad de Personas" value={formData.cantidad_personas} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required />
                <input type="number" name="precio_total" placeholder="Precio Total" value={formData.precio_total} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required />
                <select name="estado" value={formData.estado} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
                <input type="date" name="fecha_viaje_inicio" value={formData.fecha_viaje_inicio} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required />
                <input type="date" name="fecha_viaje_fin" value={formData.fecha_viaje_fin} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" required />
                <select name="empleado_id" value={formData.empleado_id} onChange={handleChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                  <option value="">Seleccionar Empleado (Opcional)</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.id} value={String(empleado.id)}>
                      {empleado.nombre} {empleado.apellido} ({empleado.numero_empleado})
                    </option>
                  ))}
                </select>
              </div>
              <textarea name="comentarios" placeholder="Comentarios" value={formData.comentarios} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600" rows="2"></textarea>
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Número</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Paquete</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Precio</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{reserva.numero_reserva}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reserva.cliente_nombre} {reserva.cliente_apellido}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reserva.paquete_nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">${reserva.precio_total}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reserva.estado)}`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => handleEdit(reserva)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(reserva.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default Reservas;
