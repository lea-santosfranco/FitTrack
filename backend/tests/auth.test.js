const request = require('supertest');
const app     = require('../server');
const pool    = require('../config/database');

let token;
const testUser = {
  username: `testuser_${Date.now()}`,
  email:    `test_${Date.now()}@example.com`,
  password: 'Password123!',
};

describe('POST /api/auth/register', () => {
  test('crée un compte non vérifié et ne renvoie pas de token', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('token');
    expect(res.body).not.toHaveProperty('user');
  });

  test('retourne 400 si le username est manquant', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com', password: 'Password123!' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si le mot de passe ne respecte pas la politique de complexité', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'u', email: 'u@u.com', password: 'simple' });
    expect(res.status).toBe(400);
  });

  test('retourne 409 si l\'email est déjà utilisé', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login avant vérification', () => {
  test('retourne 403 pour un compte non vérifié', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/auth/verify-email', () => {
  let realToken;

  test('retourne 400 pour un token invalide', async () => {
    const res = await request(app).get('/api/auth/verify-email?token=invalide');
    expect(res.status).toBe(400);
  });

  test('vérifie le compte avec le bon token', async () => {
    const [rows] = await pool.execute('SELECT verification_token FROM User WHERE email = ?', [testUser.email]);
    realToken = rows[0].verification_token;
    const res = await request(app).get(`/api/auth/verify-email?token=${realToken}`);
    expect(res.status).toBe(200);
  });

  test('retourne 400 si le même lien est réutilisé', async () => {
    const res = await request(app).get(`/api/auth/verify-email?token=${realToken}`);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login après vérification', () => {
  test('connecte un utilisateur vérifié', async () => {
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
    const res = await request(app).post('/api/auth/login').send({ email: 'unknown@x.com', password: 'Password123!' });
    expect(res.status).toBe(401);
  });

  test('retourne 400 si email manquant', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'Password123!' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/resend-verification', () => {
  test('retourne toujours une réponse générique (anti-énumération)', async () => {
    const known   = await request(app).post('/api/auth/resend-verification').send({ email: testUser.email });
    const unknown = await request(app).post('/api/auth/resend-verification').send({ email: 'inconnu_xyz@example.com' });
    expect(known.status).toBe(200);
    expect(unknown.status).toBe(200);
    expect(known.body.message).toBe(unknown.body.message);
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
