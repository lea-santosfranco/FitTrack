const request = require('supertest');
const app     = require('../server');
const jwt     = require('jsonwebtoken');

const token      = jwt.sign({ id: 999, email: 't@t.com', username: 'tester' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const adminToken = jwt.sign({ id: 1, email: 'admin@t.com', username: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const auth      = () => ({ Authorization: `Bearer ${token}` });
const authAdmin = () => ({ Authorization: `Bearer ${adminToken}` });

let createdId;

describe('GET /api/exercises', () => {
  test('retourne la liste des exercices', async () => {
    const res = await request(app).get('/api/exercises').set(auth());
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('exercises');
    expect(Array.isArray(res.body.exercises)).toBe(true);
  });

  test('filtre par catégorie valide', async () => {
    const res = await request(app).get('/api/exercises?category=Cardio').set(auth());
    expect(res.status).toBe(200);
    res.body.exercises.forEach((e) => expect(e.category).toBe('Cardio'));
  });

  test('retourne 400 pour une catégorie invalide', async () => {
    const res = await request(app).get('/api/exercises?category=InvalidCat').set(auth());
    expect(res.status).toBe(400);
  });

  test('supporte la recherche par nom', async () => {
    const res = await request(app).get('/api/exercises?search=squat').set(auth());
    expect(res.status).toBe(200);
  });
});

describe('POST /api/exercises', () => {
  test('retourne 403 pour un utilisateur non admin', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .set(auth())
      .send({ name: 'Test Exercise ' + Date.now(), category: 'Cardio', description: 'Test' });
    expect(res.status).toBe(403);
  });

  test('crée un exercice valide en tant qu\'admin', async () => {
    const res = await request(app)
      .post('/api/exercises')
      .set(authAdmin())
      .send({ name: 'Test Exercise ' + Date.now(), category: 'Cardio', description: 'Test' });
    expect(res.status).toBe(201);
    expect(res.body.exercise).toBeDefined();
    createdId = res.body.exercise.id;
  });

  test('retourne 400 si le nom est manquant', async () => {
    const res = await request(app).post('/api/exercises').set(authAdmin()).send({ category: 'Cardio' });
    expect(res.status).toBe(400);
  });

  test('retourne 400 si la catégorie est invalide', async () => {
    const res = await request(app).post('/api/exercises').set(authAdmin()).send({ name: 'Test', category: 'Wrong' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/exercises/:id', () => {
  test('retourne un exercice existant', async () => {
    if (!createdId) return;
    const res = await request(app).get(`/api/exercises/${createdId}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.exercise.id).toBe(createdId);
  });

  test('retourne 404 pour un id inconnu', async () => {
    const res = await request(app).get('/api/exercises/999999').set(auth());
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/exercises/:id', () => {
  test('retourne 403 pour un utilisateur non admin', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/exercises/${createdId}`)
      .set(auth())
      .send({ name: 'Hack Attempt' });
    expect(res.status).toBe(403);
  });

  test('met à jour un exercice en tant qu\'admin', async () => {
    if (!createdId) return;
    const res = await request(app)
      .put(`/api/exercises/${createdId}`)
      .set(authAdmin())
      .send({ name: 'Updated Exercise', category: 'Musculation' });
    expect(res.status).toBe(200);
    expect(res.body.exercise.name).toBe('Updated Exercise');
  });
});

describe('DELETE /api/exercises/:id', () => {
  test('retourne 403 pour un utilisateur non admin', async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/exercises/${createdId}`).set(auth());
    expect(res.status).toBe(403);
  });

  test('supprime un exercice existant en tant qu\'admin', async () => {
    if (!createdId) return;
    const res = await request(app).delete(`/api/exercises/${createdId}`).set(authAdmin());
    expect(res.status).toBe(200);
  });

  test('retourne 404 pour un id inexistant', async () => {
    const res = await request(app).delete('/api/exercises/999999').set(authAdmin());
    expect(res.status).toBe(404);
  });
});
