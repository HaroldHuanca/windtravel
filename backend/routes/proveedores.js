const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los proveedores
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proveedores ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// GET - Obtener un proveedor por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proveedores WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// POST - Crear un nuevo proveedor
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion } = req.body;

    if (!nombre || !tipo_proveedor) {
      return res.status(400).json({ error: 'Nombre y tipo de proveedor son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO proveedores (nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// PUT - Actualizar un proveedor
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion, activo } = req.body;

    const result = await pool.query(
      'UPDATE proveedores SET nombre = $1, tipo_proveedor = $2, contacto_nombre = $3, contacto_email = $4, contacto_telefono = $5, direccion = $6, ciudad = $7, pais = $8, codigo_postal = $9, sitio_web = $10, calificacion = $11, activo = $12 WHERE id = $13 RETURNING *',
      [nombre, tipo_proveedor, contacto_nombre, contacto_email, contacto_telefono, direccion, ciudad, pais, codigo_postal, sitio_web, calificacion, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// DELETE - Eliminar un proveedor
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM proveedores WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ mensaje: 'Proveedor eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

module.exports = router;
