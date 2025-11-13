const pool = require('../db');

describe('Database pool', () => {
  test('exporta un pool con query y on', () => {
    expect(pool).toBeDefined();
    expect(typeof pool.query).toBe('function');
    expect(typeof pool.on).toBe('function');
  });
});
