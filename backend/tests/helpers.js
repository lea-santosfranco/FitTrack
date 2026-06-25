const request = require('supertest');
const app     = require('../server');
const pool    = require('../config/database');

// Inscrit un utilisateur, vérifie son email directement en base (pas de vraie boîte mail
// en test) puis se connecte. Retourne le token JWT prêt à l'emploi pour les autres tests.
async function registerVerifiedUser(overrides = {}) {
  const unique = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const user = {
    username: `user_${unique}`,
    email:    `user_${unique}@example.com`,
    password: 'Password123!',
    ...overrides,
  };

  await request(app).post('/api/auth/register').send(user);

  const [rows] = await pool.execute(
    'SELECT id, verification_token FROM User WHERE email = ?',
    [user.email]
  );
  const { id, verification_token } = rows[0];

  await request(app).get(`/api/auth/verify-email?token=${verification_token}`);

  const loginRes = await request(app).post('/api/auth/login').send({
    email:    user.email,
    password: user.password,
  });

  return { id, token: loginRes.body.token, user: loginRes.body.user, credentials: user };
}

module.exports = { registerVerifiedUser };
