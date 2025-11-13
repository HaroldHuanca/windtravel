/**
 * Test de integración 02 - Login
 * Objetivo: verificar que el endpoint /api/auth/login devuelve token cuando las credenciales son correctas.
 * Enfoque: mockear la consulta a la base de datos para devolver un usuario existente.
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('Integración - Auth Login', () => {
  let app;
  beforeAll(() => {
    // Resetear módulos para aplicar mocks locales
    jest.resetModules();
    // Mock del pool de postgres usado en routes/auth.js
    const mockPool = { query: jest.fn(), on: jest.fn() };
    // Cuando se consulta por email, devolvemos un usuario de prueba
    mockPool.query.mockImplementation((sql, params) => {
      if (/SELECT \* FROM usuarios WHERE email = \$1/.test(sql)) {
        return Promise.resolve({ rows: [{ id: 1, nombre: 'Test', apellido: 'User', email: params[0] }] });
      }
      return Promise.resolve({ rows: [] });
    });

    jest.doMock('../db', () => mockPool);
    app = require('../server');
  });

  test('POST /api/auth/login devuelve token para credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    // Verificar token decodificado contiene email
    const decoded = jwt.decode(res.body.token);
    expect(decoded).toHaveProperty('email', 'test@example.com');
  });
});
