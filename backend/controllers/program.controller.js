const ProgramModel = require('../models/program.model');

const ProgramController = {
  // GET /api/programs
  async getAll(req, res) {
    try {
      const programs = await ProgramModel.findAll();
      res.json({ programs, count: programs.length });
    } catch (err) {
      console.error('GetAll programs error:', err);
      res.status(500).json({ error: 'Failed to fetch programs.' });
    }
  },

  // GET /api/programs/:id
  async getOne(req, res) {
    try {
      const program = await ProgramModel.findById(req.params.id);
      if (!program) return res.status(404).json({ error: 'Program not found.' });
      res.json({ program });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch program.' });
    }
  },

  // POST /api/programs/:id/clone
  async clone(req, res) {
    try {
      const date      = req.body.date || new Date().toISOString().slice(0, 10);
      const workoutId = await ProgramModel.cloneToWorkout(req.params.id, req.user.id, date);
      if (!workoutId) return res.status(404).json({ error: 'Program not found.' });
      res.status(201).json({ message: 'Program copied to your workouts.', workout_id: workoutId });
    } catch (err) {
      console.error('Clone program error:', err);
      res.status(500).json({ error: 'Failed to copy program.' });
    }
  },
};

module.exports = ProgramController;
