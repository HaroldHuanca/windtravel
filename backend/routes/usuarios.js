const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los usuarios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// GET - Obtener un usuario por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// POST - Crear un nuevo usuario
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, email, telefono]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT - Actualizar un usuario
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, telefono, activo } = req.body;

    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, apellido = $2, email = $3, telefono = $4, activo = $5 WHERE id = $6 RETURNING *',
      [nombre, apellido, email, telefono, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE - Eliminar un usuario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
