const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET - Obtener todos los empleados
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, u.nombre, u.apellido, u.email, u.telefono FROM empleados e JOIN usuarios u ON e.usuario_id = u.id ORDER BY e.id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
});

// GET - Obtener un empleado por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT e.*, u.nombre, u.apellido, u.email, u.telefono FROM empleados e JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
});

// POST - Crear un nuevo empleado
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { usuario_id, numero_empleado, departamento, puesto, salario, fecha_contratacion } = req.body;

    if (!usuario_id || !numero_empleado || !departamento || !puesto || !fecha_contratacion) {
      return res.status(400).json({ error: 'Campos requeridos faltantes' });
    }

    const normalizeDate = require('../utils/normalizeDate');
    const fechaContrNorm = normalizeDate(fecha_contratacion);
    if (!fechaContrNorm) {
      return res.status(400).json({ error: 'Fecha de contratación inválida' });
    }

    const result = await pool.query(
      'INSERT INTO empleados (usuario_id, numero_empleado, departamento, puesto, salario, fecha_contratacion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [usuario_id, numero_empleado, departamento, puesto, salario, fechaContrNorm]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El número de empleado ya existe' });
    }
    res.status(500).json({ error: 'Error al crear empleado' });
  }
});

// PUT - Actualizar un empleado
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_empleado, departamento, puesto, salario, fecha_contratacion, fecha_terminacion, activo } = req.body;

    const normalizeDate = require('../utils/normalizeDate');
    const fechaContrNorm = fecha_contratacion ? normalizeDate(fecha_contratacion) : null;
    const fechaTermNorm = fecha_terminacion ? normalizeDate(fecha_terminacion) : null;

    if ((fecha_contratacion && !fechaContrNorm) || (fecha_terminacion && !fechaTermNorm)) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    const result = await pool.query(
      'UPDATE empleados SET numero_empleado = $1, departamento = $2, puesto = $3, salario = $4, fecha_contratacion = $5, fecha_terminacion = $6, activo = $7 WHERE id = $8 RETURNING *',
      [numero_empleado, departamento, puesto, salario, fechaContrNorm, fechaTermNorm, activo, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
});

// DELETE - Eliminar un empleado
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM empleados WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json({ mensaje: 'Empleado eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
});

module.exports = router;
