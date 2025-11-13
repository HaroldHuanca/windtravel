const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];

    // Para esta versión de prueba, usamos contraseña simple
    // En producción, deberías hashear las contraseñas
    if (password !== 'password123') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ error: 'Nombre, apellido y email son requeridos' });
    }

    const existente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (existente.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, apellido, email, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, email, telefono]
    );

    const usuario = result.rows[0];

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
