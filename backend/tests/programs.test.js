const request = require('supertest');
const app     = require('../server');
const { registerVerifiedUser } = require('./helpers');

let userToken;
let programId;

const auth = () => ({ Authorization: `Bearer ${userToken}` });

beforeAll(async () => {
  const result = await registerVerifiedUser({ username: `progtest_${Date.now()}` });
  userToken = result.token;

  const programs = await request(app).get('/api/programs').set(auth());
  programId = programs.body.programs[0].id;
});

describe('GET /api/programs', () => {
  test('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/programs');
    expect(res.status).toBe(401);
  });

  test('retourne la liste des programmes', async () => {
    const res = await request(app).get('/api/programs').set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.programs)).toBe(true);
    expect(res.body.programs.length).toBeGreaterThan(0);
  });
});

describe('GET /api/programs/:id', () => {
  test('retourne un programme avec ses exercices', async () => {
    const res = await request(app).get(`/api/programs/${programId}`).set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.program.exercises)).toBe(true);
    expect(res.body.program.exercises.length).toBeGreaterThan(0);
  });

  test('retourne 404 pour un id inconnu', async () => {
    const res = await request(app).get('/api/programs/999999').set(auth());
    expect(res.status).toBe(404);
  });
});

describe('POST /api/programs/:id/clone', () => {
  test('copie le programme dans les séances de l\'utilisateur', async () => {
    const res = await request(app).post(`/api/programs/${programId}/clone`).set(auth()).send({});
    expect(res.status).toBe(201);
    expect(res.body.workout_id).toBeDefined();

    const workout = await request(app).get(`/api/workouts/${res.body.workout_id}`).set(auth());
    expect(workout.status).toBe(200);
    expect(workout.body.workout.exercises.length).toBeGreaterThan(0);
  });

  test('retourne 404 pour un programme inconnu', async () => {
    const res = await request(app).post('/api/programs/999999/clone').set(auth()).send({});
    expect(res.status).toBe(404);
  });
});
