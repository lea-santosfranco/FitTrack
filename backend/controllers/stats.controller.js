const pool = require('../config/database');

const StatsController = {
  // GET /api/stats
  async getStats(req, res) {
    try {
      const userId = req.user.id;

      const [[{ total_workouts }]] = await pool.execute(
        'SELECT COUNT(*) AS total_workouts FROM Workout WHERE user_id = ?',
        [userId]
      );

      const [[{ total_duration }]] = await pool.execute(
        'SELECT COALESCE(SUM(duration), 0) AS total_duration FROM Workout WHERE user_id = ?',
        [userId]
      );

      const [[{ distinct_exercises }]] = await pool.execute(
        `SELECT COUNT(DISTINCT we.exercise_id) AS distinct_exercises
           FROM WorkoutExercise we
           JOIN Workout w ON w.id = we.workout_id
          WHERE w.user_id = ?`,
        [userId]
      );

      const [recentWorkouts] = await pool.execute(
        `SELECT date, title, duration
           FROM Workout
          WHERE user_id = ? AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
          ORDER BY date ASC`,
        [userId]
      );

      const [topExercises] = await pool.execute(
        `SELECT e.name, e.category, COUNT(we.id) AS count
           FROM WorkoutExercise we
           JOIN Exercise e ON e.id = we.exercise_id
           JOIN Workout w  ON w.id = we.workout_id
          WHERE w.user_id = ?
          GROUP BY e.id
          ORDER BY count DESC
          LIMIT 5`,
        [userId]
      );

      const [categoryBreakdown] = await pool.execute(
        `SELECT e.category, COUNT(we.id) AS count
           FROM WorkoutExercise we
           JOIN Exercise e ON e.id = we.exercise_id
           JOIN Workout w  ON w.id = we.workout_id
          WHERE w.user_id = ?
          GROUP BY e.category`,
        [userId]
      );

      res.json({
        total_workouts,
        total_duration,
        distinct_exercises,
        recent_workouts:    recentWorkouts,
        top_exercises:      topExercises,
        category_breakdown: categoryBreakdown,
      });
    } catch (err) {
      console.error('Stats error:', err);
      res.status(500).json({ error: 'Failed to fetch stats.' });
    }
  },
};

module.exports = StatsController;
