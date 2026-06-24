const pool = require('../config/database');

const WorkoutModel = {
  async findAllByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT w.*,
              COUNT(we.id) AS exercise_count
         FROM Workout w
         LEFT JOIN WorkoutExercise we ON we.workout_id = w.id
        WHERE w.user_id = ?
        GROUP BY w.id
        ORDER BY w.date DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [workouts] = await pool.execute(
      'SELECT * FROM Workout WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    if (!workouts[0]) return null;

    const [exercises] = await pool.execute(
      `SELECT we.id AS we_id, we.sets, we.reps, we.weight_used, we.duration,
              e.id, e.name, e.category, e.muscle_group
         FROM WorkoutExercise we
         JOIN Exercise e ON e.id = we.exercise_id
        WHERE we.workout_id = ?`,
      [id]
    );

    return { ...workouts[0], exercises };
  },

  async create({ user_id, title, date, duration, notes }) {
    const [result] = await pool.execute(
      'INSERT INTO Workout (user_id, title, date, duration, notes) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, date, duration || null, notes || null]
    );
    return result.insertId;
  },

  async update(id, userId, { title, date, duration, notes }) {
    const fields = [];
    const values = [];

    if (title    !== undefined) { fields.push('title = ?');    values.push(title); }
    if (date     !== undefined) { fields.push('date = ?');     values.push(date); }
    if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
    if (notes    !== undefined) { fields.push('notes = ?');    values.push(notes); }

    if (fields.length === 0) return this.findById(id, userId);

    values.push(id, userId);
    await pool.execute(
      `UPDATE Workout SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );
    return this.findById(id, userId);
  },

  async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM Workout WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async addExercise(workoutId, { exercise_id, sets, reps, weight_used, duration }) {
    const [result] = await pool.execute(
      'INSERT INTO WorkoutExercise (workout_id, exercise_id, sets, reps, weight_used, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [workoutId, exercise_id, sets || null, reps || null, weight_used || null, duration || null]
    );
    return result.insertId;
  },

  async updateExercise(weId, workoutId, { sets, reps, weight_used, duration }) {
    const fields = [];
    const values = [];

    if (sets        !== undefined) { fields.push('sets = ?');        values.push(sets); }
    if (reps        !== undefined) { fields.push('reps = ?');        values.push(reps); }
    if (weight_used !== undefined) { fields.push('weight_used = ?'); values.push(weight_used); }
    if (duration    !== undefined) { fields.push('duration = ?');    values.push(duration); }

    if (fields.length === 0) return;

    values.push(weId, workoutId);
    await pool.execute(
      `UPDATE WorkoutExercise SET ${fields.join(', ')} WHERE id = ? AND workout_id = ?`,
      values
    );
  },

  async removeExercise(weId, workoutId) {
    const [result] = await pool.execute(
      'DELETE FROM WorkoutExercise WHERE id = ? AND workout_id = ?',
      [weId, workoutId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = WorkoutModel;
