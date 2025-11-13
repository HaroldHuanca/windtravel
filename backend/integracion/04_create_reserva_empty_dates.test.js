/**
 * Test de integración 04 - Crear reserva con fechas vacías
 * Objetivo: verificar que el backend rechaza fechas vacías con 400 y mensaje adecuado.
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Integración - Crear Reserva Fechas Vacías', () => {
  let app;
  beforeAll(() => {
    jest.resetModules();
    // Mock pool que no será llamado en este caso
    const mockPool = { query: jest.fn(), on: jest.fn() };
    jest.doMock('../db', () => mockPool);
    app = require('../server');
  });

  test('POST /api/reservas con fechas vacías devuelve 400', async () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);
    const payload = {
      cliente_id: 1,
      paquete_id: 1,
      cantidad_personas: 2,
      precio_total: 2700000.0,
      estado: 'Pendiente',
      fecha_viaje_inicio: '',
      fecha_viaje_fin: '',
      comentarios: 'Fechas vacías'
    };

    const res = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/Fechas de viaje inválidas/);
  });
});
