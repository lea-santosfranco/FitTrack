const request = require('supertest');
const app     = require('../server');
const jwt     = require('jsonwebtoken');

describe('Middleware auth', () => {
  test('retourne 401 sans header Authorization', async () => {
    const res = await request(app).get('/api/exercises');
    expect(res.status).toBe(401);
  });

  test('retourne 401 avec format de token incorrect', async () => {
    const res = await request(app).get('/api/exercises').set('Authorization', 'token_sans_bearer');
    expect(res.status).toBe(401);
  });

  test('retourne 401 avec un token invalide', async () => {
    const res = await request(app).get('/api/exercises').set('Authorization', 'Bearer invalid.token.here');
    expect(res.status).toBe(401);
  });

  test('retourne 401 avec un token expiré', async () => {
    const expiredToken = jwt.sign({ id: 1, email: 'x@x.com', username: 'x' }, process.env.JWT_SECRET, { expiresIn: '0s' });
    await new Promise(r => setTimeout(r, 100));
    const res = await request(app).get('/api/exercises').set('Authorization', `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/expired/i);
  });

  test('laisse passer avec un token valide', async () => {
    const validToken = jwt.sign({ id: 999, email: 'v@v.com', username: 'valid' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/api/exercises').set('Authorization', `Bearer ${validToken}`);
    // 200 ou 500 (si DB pas dispo) mais pas 401
    expect(res.status).not.toBe(401);
  });
});
