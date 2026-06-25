const express      = require('express');
const cors         = require('cors');
const dotenv       = require('dotenv');
const helmet       = require('helmet');
const rateLimit    = require('express-rate-limit');
const swaggerUi    = require('swagger-ui-express');

dotenv.config();

const authRoutes     = require('./routes/auth.routes');
const exerciseRoutes = require('./routes/exercise.routes');
const workoutRoutes  = require('./routes/workout.routes');
const statsRoutes    = require('./routes/stats.routes');
const adminRoutes    = require('./routes/admin.routes');
const programRoutes  = require('./routes/program.routes');
const swaggerSpec    = require('./config/swagger');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares globaux ──────────────────────────────────────────────────
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Limite les tentatives de connexion/inscription pour empêcher le brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit:    process.env.NODE_ENV === 'test' ? 10000 : 10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many attempts, please try again later.' },
});

// ── Documentation API ────────────────────────────────────────────────────
// CSP désactivée ici : swagger-ui-express injecte un script inline pour s'initialiser.
app.use('/api/docs', (req, res, next) => { res.removeHeader('Content-Security-Policy'); next(); }, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth/login',               authLimiter);
app.use('/api/auth/register',            authLimiter);
app.use('/api/auth/resend-verification', authLimiter);
app.use('/api/auth',      authRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/workouts',  workoutRoutes);
app.use('/api/stats',     statsRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/programs',  programRoutes);

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
