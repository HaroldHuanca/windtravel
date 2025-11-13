const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los clientes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT c.*, u.nombre, u.apellido, u.email, u.telefono FROM clientes c JOIN usuarios u ON c.usuario_id = u.id ORDER BY c.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// GET - Obtener un cliente por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT c.*, u.nombre, u.apellido, u.email, u.telefono FROM clientes c JOIN usuarios u ON c.usuario_id = u.id WHERE c.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

// POST - Crear un nuevo cliente
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { usuario_id, documento_identidad, tipo_documento, fecha_nacimiento, direccion, ciudad, pais, codigo_postal, preferencias } = req.body;

    if (!usuario_id || !documento_identidad || !tipo_documento) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    const normalizeDate = require('../utils/normalizeDate');
    const fechaNacNorm = fecha_nacimiento ? normalizeDate(fecha_nacimiento) : null;
    if (fecha_nacimiento && !fechaNacNorm) {
      return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (usuario_id, documento_identidad, tipo_documento, fecha_nacimiento, direccion, ciudad, pais, codigo_postal, preferencias) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [usuario_id, documento_identidad, tipo_documento, fechaNacNorm, direccion, ciudad, pais, codigo_postal, preferencias]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El documento ya existe' });
    }
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// PUT - Actualizar un cliente
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { documento_identidad, tipo_documento, fecha_nacimiento, direccion, ciudad, pais, codigo_postal, preferencias } = req.body;

    const normalizeDate = require('../utils/normalizeDate');
    const fechaNacNorm = fecha_nacimiento ? normalizeDate(fecha_nacimiento) : null;
    if (fecha_nacimiento && !fechaNacNorm) {
      return res.status(400).json({ error: 'Fecha de nacimiento inválida' });
    }

    const result = await pool.query(
      'UPDATE clientes SET documento_identidad = $1, tipo_documento = $2, fecha_nacimiento = $3, direccion = $4, ciudad = $5, pais = $6, codigo_postal = $7, preferencias = $8 WHERE id = $9 RETURNING *',
      [documento_identidad, tipo_documento, fechaNacNorm, direccion, ciudad, pais, codigo_postal, preferencias, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// DELETE - Eliminar un cliente
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
