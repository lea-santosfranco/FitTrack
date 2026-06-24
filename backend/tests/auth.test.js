const request = require('supertest');
const app     = require('../server');

let token;
const testUser = {
  username: `testuser_${Date.now()}`,
  email:    `test_${Date.now()}@example.com`,
  password: 'password123',
};

describe('POST /api/auth/register', () => {
  test('crée un compte avec des données valides', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(testUser.username);
    token = res.body.token;
  });

  test('retourne 400 si le username est manquant', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: '123456' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si le mot de passe est trop court', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'u', email: 'u@u.com', password: '123' });
    expect(res.status).toBe(400);
  });

  test('retourne 409 si l\'email est déjà utilisé', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  test('connecte un utilisateur existant', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('retourne 401 avec un mauvais mot de passe', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });

  test('retourne 401 avec un email inconnu', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'unknown@x.com', password: 'pass123' });
    expect(res.status).toBe(401);
  });

  test('retourne 400 si email manquant', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'pass123' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  test('retourne le profil avec un token valide', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('retourne 401 avec un token invalide', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer fake_token');
    expect(res.status).toBe(401);
  });
});

module.exports = { getToken: () => token };
