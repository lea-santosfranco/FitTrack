const request = require('supertest');
const app     = require('../server');
const jwt     = require('jsonwebtoken');
const { registerVerifiedUser } = require('./helpers');

const adminToken = jwt.sign({ id: 1, email: 'admin@t.com', username: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const userToken  = jwt.sign({ id: 999, email: 't@t.com', username: 'tester', role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const authAdmin  = () => ({ Authorization: `Bearer ${adminToken}` });
const authUser   = () => ({ Authorization: `Bearer ${userToken}` });

let targetId;

beforeAll(async () => {
  const target = await registerVerifiedUser({ username: `roletest_${Date.now()}` });
  targetId = target.id;
});

describe('GET /api/admin/users', () => {
  test('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  test('retourne 403 pour un utilisateur non admin', async () => {
    const res = await request(app).get('/api/admin/users').set(authUser());
    expect(res.status).toBe(403);
  });

  test('retourne la liste des utilisateurs pour un admin', async () => {
    const res = await request(app).get('/api/admin/users').set(authAdmin());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });
});

describe('PATCH /api/admin/users/:id/role', () => {
  test('retourne 403 pour un utilisateur non admin', async () => {
    const res = await request(app).patch(`/api/admin/users/${targetId}/role`).set(authUser()).send({ role: 'admin' });
    expect(res.status).toBe(403);
  });

  test('retourne 400 pour un rôle invalide', async () => {
    const res = await request(app).patch(`/api/admin/users/${targetId}/role`).set(authAdmin()).send({ role: 'superadmin' });
    expect(res.status).toBe(400);
  });

  test('promeut un utilisateur en admin', async () => {
    const res = await request(app).patch(`/api/admin/users/${targetId}/role`).set(authAdmin()).send({ role: 'admin' });
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('admin');
  });

  test('retourne 404 pour un utilisateur inconnu', async () => {
    const res = await request(app).patch('/api/admin/users/999999/role').set(authAdmin()).send({ role: 'admin' });
    expect(res.status).toBe(404);
  });
});
