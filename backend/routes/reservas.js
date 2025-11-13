const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todas las reservas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT r.*, c.documento_identidad, u.nombre as cliente_nombre, u.apellido as cliente_apellido, p.nombre as paquete_nombre, e.numero_empleado FROM reservas r JOIN clientes c ON r.cliente_id = c.id JOIN usuarios u ON c.usuario_id = u.id JOIN paquetes_turisticos p ON r.paquete_id = p.id LEFT JOIN empleados e ON r.empleado_id = e.id ORDER BY r.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// GET - Obtener una reserva por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT r.*, c.documento_identidad, u.nombre as cliente_nombre, u.apellido as cliente_apellido, p.nombre as paquete_nombre, e.numero_empleado FROM reservas r JOIN clientes c ON r.cliente_id = c.id JOIN usuarios u ON c.usuario_id = u.id JOIN paquetes_turisticos p ON r.paquete_id = p.id LEFT JOIN empleados e ON r.empleado_id = e.id WHERE r.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
});

// POST - Crear una nueva reserva
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { cliente_id, paquete_id, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id } = req.body;

    console.log('Datos recibidos:', { cliente_id, paquete_id, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id });

    if (!cliente_id || !paquete_id || !cantidad_personas || !precio_total || !estado || !fecha_viaje_inicio || !fecha_viaje_fin) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    // Convertir IDs a números
    const clienteIdNum = parseInt(cliente_id, 10);
    const paqueteIdNum = parseInt(paquete_id, 10);
    const cantidadNum = parseInt(cantidad_personas, 10);
    const precioNum = parseFloat(precio_total);
    const empleadoIdNum = empleado_id ? parseInt(empleado_id, 10) : null;

    console.log('Valores convertidos:', { clienteIdNum, paqueteIdNum, cantidadNum, precioNum, empleadoIdNum });

    // Validar que las conversiones fueron exitosas
    if (isNaN(clienteIdNum) || isNaN(paqueteIdNum) || isNaN(cantidadNum) || isNaN(precioNum)) {
      return res.status(400).json({ error: 'Valores numéricos inválidos' });
    }

    // Generar número de reserva único
    const numeroReserva = `RES-${Date.now()}`;

    const result = await pool.query(
      'INSERT INTO reservas (cliente_id, paquete_id, numero_reserva, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [clienteIdNum, paqueteIdNum, numeroReserva, cantidadNum, precioNum, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleadoIdNum]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Error al crear reserva', details: error.message });
  }
});

// PUT - Actualizar una reserva
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, paquete_id, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id, fecha_confirmacion, fecha_cancelacion, razon_cancelacion } = req.body;

    console.log('Datos recibidos para actualizar:', { cliente_id, paquete_id, cantidad_personas, precio_total, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleado_id });

    // Convertir IDs a números
    const clienteIdNum = cliente_id ? parseInt(cliente_id, 10) : null;
    const paqueteIdNum = paquete_id ? parseInt(paquete_id, 10) : null;
    const cantidadNum = cantidad_personas ? parseInt(cantidad_personas, 10) : null;
    const precioNum = precio_total ? parseFloat(precio_total) : null;
    const empleadoIdNum = empleado_id ? parseInt(empleado_id, 10) : null;
    const idNum = parseInt(id, 10);

    console.log('Valores convertidos:', { clienteIdNum, paqueteIdNum, cantidadNum, precioNum, empleadoIdNum });

    const result = await pool.query(
      'UPDATE reservas SET cliente_id = $1, paquete_id = $2, cantidad_personas = $3, precio_total = $4, estado = $5, fecha_viaje_inicio = $6, fecha_viaje_fin = $7, comentarios = $8, empleado_id = $9, fecha_confirmacion = $10, fecha_cancelacion = $11, razon_cancelacion = $12 WHERE id = $13 RETURNING *',
      [clienteIdNum, paqueteIdNum, cantidadNum, precioNum, estado, fecha_viaje_inicio, fecha_viaje_fin, comentarios, empleadoIdNum, fecha_confirmacion, fecha_cancelacion, razon_cancelacion, idNum]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    res.status(500).json({ error: 'Error al actualizar reserva', details: error.message });
  }
});

// DELETE - Eliminar una reserva
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM reservas WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json({ mensaje: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

module.exports = router;
