/**
 * Test de integración 01 - Health endpoint
 * Objetivo: verificar que el endpoint de salud responde correctamente.
 * Escenario: petición GET a /api/health sin autenticación.
 * Resultado esperado: 200 OK y JSON con { status: 'Backend TravelCRM funcionando correctamente' }.
 */

const request = require('supertest');

describe('Integración - Health', () => {
  let app;
  beforeAll(() => {
    // requerir la app directamente (no mockeamos DB aquí)
    app = require('../server');
  });

  test('GET /api/health responde 200 con status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toMatch(/Backend TravelCRM funcionando correctamente/);
  });
});
