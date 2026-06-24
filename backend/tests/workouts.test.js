const request = require('supertest');
const app     = require('../server');
const jwt     = require('jsonwebtoken');

// Utilisateur de test simulé (id doit exister dans la DB pour les workouts)
// Les tests workouts nécessitent un utilisateur réel dans la DB.
// On crée d'abord un compte, puis on utilise son token.

let token;
let workoutId;

beforeAll(async () => {
  const unique = Date.now();
  const res = await request(app).post('/api/auth/register').send({
    username: `wtest_${unique}`,
    email:    `wtest_${unique}@example.com`,
    password: 'password123',
  });
  token = res.body.token;
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('POST /api/workouts', () => {
  test('crée une séance valide', async () => {
    const res = await request(app)
      .post('/api/workouts')
      .set(auth())
      .send({ title: 'Push Day', date: '2026-06-01', duration: 60 });
    expect(res.status).toBe(201);
    expect(res.body.workout).toBeDefined();
    workoutId = res.body.workout.id;
  });

  test('retourne 400 si le titre manque', async () => {
    const res = await request(app).post('/api/workouts').set(auth()).send({ date: '2026-06-01' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si la date manque', async () => {
    const res = await request(app).post('/api/workouts').set(auth()).send({ title: 'No date' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/workouts', () => {
  test('retourne la liste des séances', async () => {
    const res = await request(app).get('/api/workouts').set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.workouts)).toBe(true);
  });
});

describe('GET /api/workouts/:id', () => {
  test('retourne une séance avec ses exercices', async () => {
    if (!workoutId) return;
    const res = await request(app).get(`/api/workouts/${workoutId}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.workout.id).toBe(workoutId);
    expect(Array.isArray(res.body.workout.exercises)).toBe(true);
  });

  test('retourne 404 pour un id inconnu', async () => {
    const res = await request(app).get('/api/workouts/999999').set(auth());
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/workouts/:id', () => {
  test('met à jour une séance', async () => {
    if (!workoutId) return;
    const res = await request(app)
      .put(`/api/workouts/${workoutId}`)
      .set(auth())
      .send({ title: 'Updated Push Day', duration: 75 });
    expect(res.status).toBe(200);
    expect(res.body.workout.title).toBe('Updated Push Day');
  });
});

describe('DELETE /api/workouts/:id', () => {
  test('supprime une séance', async () => {
    if (!workoutId) return;
    const res = await request(app).delete(`/api/workouts/${workoutId}`).set(auth());
    expect(res.status).toBe(200);
  });
});
