const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los paquetes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT p.*, pr.nombre as proveedor_nombre FROM paquetes_turisticos p LEFT JOIN proveedores pr ON p.proveedor_id = pr.id ORDER BY p.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener paquetes' });
  }
});

// GET - Obtener un paquete por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT p.*, pr.nombre as proveedor_nombre FROM paquetes_turisticos p LEFT JOIN proveedores pr ON p.proveedor_id = pr.id WHERE p.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener paquete' });
  }
});

const normalizeDate = require('../utils/normalizeDate');

// POST - Crear un nuevo paquete
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fecha_inicio, fecha_fin, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id } = req.body;

    if (!nombre || !destino || !duracion_dias || !precio_base || !precio_actual || !capacidad_maxima || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    const fechaInicioNorm = normalizeDate(fecha_inicio);
    const fechaFinNorm = normalizeDate(fecha_fin);

    if (!fechaInicioNorm || !fechaFinNorm) {
      return res.status(400).json({ error: 'Fechas de paquete inválidas' });
    }

    const result = await pool.query(
      'INSERT INTO paquetes_turisticos (nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fecha_inicio, fecha_fin, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *',
      [nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fechaInicioNorm, fechaFinNorm, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear paquete' });
  }
});

// PUT - Actualizar un paquete
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fecha_inicio, fecha_fin, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id, activo } = req.body;

    const fechaInicioNorm = normalizeDate(fecha_inicio);
    const fechaFinNorm = normalizeDate(fecha_fin);

    if ((fecha_inicio && !fechaInicioNorm) || (fecha_fin && !fechaFinNorm)) {
      return res.status(400).json({ error: 'Fechas de paquete inválidas' });
    }

    const result = await pool.query(
      'UPDATE paquetes_turisticos SET nombre = $1, descripcion = $2, destino = $3, duracion_dias = $4, precio_base = $5, precio_actual = $6, capacidad_maxima = $7, disponibles = $8, fecha_inicio = $9, fecha_fin = $10, incluye_transporte = $11, incluye_alojamiento = $12, incluye_comidas = $13, incluye_tours = $14, nivel_dificultad = $15, tipo_paquete = $16, proveedor_id = $17, activo = $18 WHERE id = $19 RETURNING *',
      [nombre, descripcion, destino, duracion_dias, precio_base, precio_actual, capacidad_maxima, disponibles, fechaInicioNorm, fechaFinNorm, incluye_transporte, incluye_alojamiento, incluye_comidas, incluye_tours, nivel_dificultad, tipo_paquete, proveedor_id, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar paquete' });
  }
});

// DELETE - Eliminar un paquete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM paquetes_turisticos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Paquete no encontrado' });
    }

    res.json({ mensaje: 'Paquete eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar paquete' });
  }
});

module.exports = router;
