const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const clientesRoutes = require('./routes/clientes');
const empleadosRoutes = require('./routes/empleados');
const proveedoresRoutes = require('./routes/proveedores');
const paquetesRoutes = require('./routes/paquetes');
const reservasRoutes = require('./routes/reservas');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/reservas', reservasRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend TravelCRM funcionando correctamente' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor TravelCRM ejecutándose en puerto ${PORT}`);
  });
}

// Export app for testing (supertest)
module.exports = app;
