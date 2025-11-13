/**
 * Test de integración 03 - Crear reserva (éxito)
 * Objetivo: verificar que POST /api/reservas crea una reserva válida.
 * Enfoque: mockear pool.query para devolver la fila insertada.
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Integración - Crear Reserva Éxito', () => {
  let app;
  let mockPool;
  beforeAll(() => {
    jest.resetModules();
    mockPool = { query: jest.fn(), on: jest.fn() };
    // Mock del INSERT en reservas
    mockPool.query.mockImplementation((sql, params) => {
      if (/INSERT INTO reservas/.test(sql)) {
        // Simular que la DB devuelve la fila creada
        return Promise.resolve({ rows: [{ id: 123, cliente_id: params[0], paquete_id: params[1], numero_reserva: params[2] }] });
      }
      return Promise.resolve({ rows: [] });
    });
    jest.doMock('../db', () => mockPool);
    app = require('../server');
  });

  test('POST /api/reservas crea reserva y devuelve 201', async () => {
    // Generar token válido
    const token = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);

    const payload = {
      cliente_id: 1,
      paquete_id: 1,
      cantidad_personas: 2,
      precio_total: 2700000.0,
      estado: 'Confirmada',
      fecha_viaje_inicio: '2025-01-15',
      fecha_viaje_fin: '2025-01-20',
      comentarios: 'Integración test',
      empleado_id: 1
    };

    const res = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', 123);
    // Verificar que el mock fue llamado con fechas normalizadas (Date objects)
    const insertCall = mockPool.query.mock.calls.find(c => /INSERT INTO reservas/.test(c[0]));
    expect(insertCall).toBeDefined();
    // The fecha_viaje_inicio argument should be a Date object
    expect(insertCall[1][6] instanceof Date).toBe(true);
  });
});
