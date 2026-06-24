const WorkoutModel = require('../models/workout.model');

const WorkoutController = {
  // GET /api/workouts
  async getAll(req, res) {
    try {
      const workouts = await WorkoutModel.findAllByUser(req.user.id);
      res.json({ workouts, count: workouts.length });
    } catch (err) {
      console.error('GetAll workouts error:', err);
      res.status(500).json({ error: 'Failed to fetch workouts.' });
    }
  },

  // GET /api/workouts/:id
  async getOne(req, res) {
    try {
      const workout = await WorkoutModel.findById(req.params.id, req.user.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found.' });
      res.json({ workout });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch workout.' });
    }
  },

  // POST /api/workouts
  async create(req, res) {
    try {
      const { title, date, duration, notes, exercises } = req.body;
      if (!title || !date) {
        return res.status(400).json({ error: 'Title and date are required.' });
      }

      const workoutId = await WorkoutModel.create({
        user_id: req.user.id, title, date, duration, notes,
      });

      if (Array.isArray(exercises) && exercises.length > 0) {
        for (const ex of exercises) {
          if (!ex.exercise_id) continue;
          await WorkoutModel.addExercise(workoutId, ex);
        }
      }

      const workout = await WorkoutModel.findById(workoutId, req.user.id);
      res.status(201).json({ message: 'Workout created.', workout });
    } catch (err) {
      console.error('Create workout error:', err);
      res.status(500).json({ error: 'Failed to create workout.' });
    }
  },

  // PUT /api/workouts/:id
  async update(req, res) {
    try {
      const existing = await WorkoutModel.findById(req.params.id, req.user.id);
      if (!existing) return res.status(404).json({ error: 'Workout not found.' });

      const { title, date, duration, notes } = req.body;
      const workout = await WorkoutModel.update(req.params.id, req.user.id, { title, date, duration, notes });
      res.json({ message: 'Workout updated.', workout });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update workout.' });
    }
  },

  // DELETE /api/workouts/:id
  async delete(req, res) {
    try {
      const deleted = await WorkoutModel.delete(req.params.id, req.user.id);
      if (!deleted) return res.status(404).json({ error: 'Workout not found.' });
      res.json({ message: 'Workout deleted.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete workout.' });
    }
  },

  // POST /api/workouts/:id/exercises
  async addExercise(req, res) {
    try {
      const workout = await WorkoutModel.findById(req.params.id, req.user.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found.' });

      const { exercise_id, sets, reps, weight_used, duration } = req.body;
      if (!exercise_id) {
        return res.status(400).json({ error: 'exercise_id is required.' });
      }

      await WorkoutModel.addExercise(req.params.id, { exercise_id, sets, reps, weight_used, duration });
      const updated = await WorkoutModel.findById(req.params.id, req.user.id);
      res.status(201).json({ message: 'Exercise added to workout.', workout: updated });
    } catch (err) {
      console.error('AddExercise error:', err);
      res.status(500).json({ error: 'Failed to add exercise.' });
    }
  },

  // PATCH /api/workouts/:id/exercises/:weId
  async updateExercise(req, res) {
    try {
      const workout = await WorkoutModel.findById(req.params.id, req.user.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found.' });

      const { sets, reps, weight_used, duration } = req.body;
      await WorkoutModel.updateExercise(req.params.weId, req.params.id, { sets, reps, weight_used, duration });
      const updated = await WorkoutModel.findById(req.params.id, req.user.id);
      res.json({ message: 'Exercise updated.', workout: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update exercise.' });
    }
  },

  // DELETE /api/workouts/:id/exercises/:weId
  async removeExercise(req, res) {
    try {
      const workout = await WorkoutModel.findById(req.params.id, req.user.id);
      if (!workout) return res.status(404).json({ error: 'Workout not found.' });

      const removed = await WorkoutModel.removeExercise(req.params.weId, req.params.id);
      if (!removed) return res.status(404).json({ error: 'Exercise entry not found.' });
      res.json({ message: 'Exercise removed from workout.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to remove exercise.' });
    }
  },
};

module.exports = WorkoutController;
