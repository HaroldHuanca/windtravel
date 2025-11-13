/**
 * Test de integración 05 - Actualizar reserva con fecha inválida
 * Objetivo: verificar que enviar una fecha inválida al actualizar devuelve 400.
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Integración - Actualizar Reserva Fecha Inválida', () => {
  let app;
  beforeAll(() => {
    jest.resetModules();
    // Mock pool que no será invocado si la validación falla
    const mockPool = { query: jest.fn(), on: jest.fn() };
    jest.doMock('../db', () => mockPool);
    app = require('../server');
  });

  test('PUT /api/reservas/:id con fecha inválida devuelve 400', async () => {
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);
    const res = await request(app)
      .put('/api/reservas/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ fecha_viaje_inicio: 'not-a-date' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toMatch(/Fechas de viaje inválidas|Fechas inválidas/);
  });
});
