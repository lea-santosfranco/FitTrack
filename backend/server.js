const express      = require('express');
const cors         = require('cors');
const dotenv       = require('dotenv');
const swaggerUi    = require('swagger-ui-express');

dotenv.config();

const authRoutes     = require('./routes/auth.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const workoutRoutes  = require('./routes/workout.routes');
const statsRoutes    = require('./routes/stats.routes');
const adminRoutes    = require('./routes/admin.routes');
const swaggerSpec    = require('./config/swagger');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globaux ──────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Documentation API ────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts',  workoutRoutes);
app.use('/api/stats',     statsRoutes);
app.use('/api/admin',     adminRoutes);

// ── Health check ─────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({ message: 'FitTrack API is running', version: '1.0' });
});

// ── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Erreurs globales ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Démarrage ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
