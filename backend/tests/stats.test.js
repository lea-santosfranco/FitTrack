const request = require('supertest');
const app     = require('../server');

let token;

beforeAll(async () => {
  const unique = Date.now();
  const res = await request(app).post('/api/auth/register').send({
    username: `stattest_${unique}`,
    email:    `stattest_${unique}@example.com`,
    password: 'password123',
  });
  token = res.body.token;
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('GET /api/stats', () => {
  test('retourne les statistiques agrégées avec records et streak', async () => {
    const res = await request(app).get('/api/stats').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total_workouts');
    expect(res.body).toHaveProperty('personal_records');
    expect(res.body).toHaveProperty('streak');
    expect(Array.isArray(res.body.personal_records)).toBe(true);
    expect(typeof res.body.streak).toBe('number');
  });

  test('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/stats/export/csv', () => {
  test('retourne un fichier CSV', async () => {
    const res = await request(app).get('/api/stats/export/csv').set(auth());
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/csv/);
  });
});

describe('GET /api/stats/export/pdf', () => {
  test('retourne un fichier PDF', async () => {
    const res = await request(app).get('/api/stats/export/pdf').set(auth());
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
  });
});
