const pool = require('../config/database');

const ProgramModel = {
  async findAll() {
    const [rows] = await pool.execute('SELECT * FROM Program ORDER BY id ASC');
    return rows;
  },

  async findById(id) {
    const [programs] = await pool.execute('SELECT * FROM Program WHERE id = ?', [id]);
    if (!programs[0]) return null;

    const [exercises] = await pool.execute(
      `SELECT pe.id AS pe_id, pe.sets, pe.reps, pe.position,
              e.id, e.name, e.category, e.muscle_group
         FROM ProgramExercise pe
         JOIN Exercise e ON e.id = pe.exercise_id
        WHERE pe.program_id = ?
        ORDER BY pe.position ASC`,
      [id]
    );

    return { ...programs[0], exercises };
  },

  // Copie un programme dans les séances personnelles de l'utilisateur
  async cloneToWorkout(programId, userId, date) {
    const program = await this.findById(programId);
    if (!program) return null;

    const [result] = await pool.execute(
      'INSERT INTO Workout (user_id, title, date, notes) VALUES (?, ?, ?, ?)',
      [userId, program.name, date, `Copié depuis le programme "${program.name}".`]
    );
    const workoutId = result.insertId;

    for (const ex of program.exercises) {
      await pool.execute(
        'INSERT INTO WorkoutExercise (workout_id, exercise_id, sets, reps) VALUES (?, ?, ?, ?)',
        [workoutId, ex.id, ex.sets, ex.reps]
      );
    }

    return workoutId;
  },
};

module.exports = ProgramModel;
