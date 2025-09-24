const request = require('supertest');
const app = require('../server'); // Adjust path if needed

describe('CORS Policy', () => {
  it('should allow requests from allowed origin', async () => {
    const res = await request(app)
      .get('/otherExpense/')
      .set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('should block requests from disallowed origin', async () => {
    const res = await request(app)
      .get('/otherExpense/')
      .set('Origin', 'https://evil.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});