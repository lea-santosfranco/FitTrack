const pool       = require('../config/database');
const PDFDocument = require('pdfkit');

const toDateStr = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

const computeStreak = (dateStrings) => {
  if (dateStrings.length === 0) return 0;
  const days = new Set(dateStrings);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!days.has(toDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toDateStr(cursor))) return 0;
  }

  let streak = 0;
  while (days.has(toDateStr(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const fetchHistory = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT w.date, w.title, w.duration, w.notes,
            GROUP_CONCAT(e.name SEPARATOR ', ') AS exercises
       FROM Workout w
       LEFT JOIN WorkoutExercise we ON we.workout_id = w.id
       LEFT JOIN Exercise e ON e.id = we.exercise_id
      WHERE w.user_id = ?
      GROUP BY w.id
      ORDER BY w.date DESC`,
    [userId]
  );
  return rows;
};

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

      // Records personnels : charge maximale par exercice
      const [repsWithWeight] = await pool.execute(
        `SELECT e.id AS exercise_id, e.name, e.category, we.weight_used, w.date
           FROM WorkoutExercise we
           JOIN Exercise e ON e.id = we.exercise_id
           JOIN Workout w  ON w.id = we.workout_id
          WHERE w.user_id = ? AND we.weight_used IS NOT NULL`,
        [userId]
      );

      const prByExercise = {};
      for (const row of repsWithWeight) {
        const best = prByExercise[row.exercise_id];
        if (!best || Number(row.weight_used) > Number(best.weight_used)) {
          prByExercise[row.exercise_id] = {
            exercise_id: row.exercise_id,
            name:        row.name,
            category:    row.category,
            weight_used: row.weight_used,
            date:        row.date,
          };
        }
      }
      const personalRecords = Object.values(prByExercise).sort((a, b) => b.weight_used - a.weight_used);

      // Streak : jours consécutifs avec au moins une séance
      const [dateRows] = await pool.execute(
        'SELECT DISTINCT date FROM Workout WHERE user_id = ?',
        [userId]
      );
      const streak = computeStreak(dateRows.map(r => toDateStr(r.date)));

      res.json({
        total_workouts,
        total_duration,
        distinct_exercises,
        recent_workouts:    recentWorkouts,
        top_exercises:      topExercises,
        category_breakdown: categoryBreakdown,
        personal_records:   personalRecords,
        streak,
      });
    } catch (err) {
      console.error('Stats error:', err);
      res.status(500).json({ error: 'Failed to fetch stats.' });
    }
  },

  // GET /api/stats/export/csv
  async exportCsv(req, res) {
    try {
      const rows = await fetchHistory(req.user.id);
      const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
      const header = ['Date', 'Titre', 'Duree (min)', 'Exercices', 'Notes'].join(';');
      const lines = rows.map(r => [
        toDateStr(r.date),
        escape(r.title),
        r.duration ?? '',
        escape(r.exercises),
        escape(r.notes),
      ].join(';'));

      const csv = '﻿' + [header, ...lines].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="fittrack_historique.csv"');
      res.send(csv);
    } catch (err) {
      console.error('ExportCsv error:', err);
      res.status(500).json({ error: 'Failed to export CSV.' });
    }
  },

  // GET /api/stats/export/pdf
  async exportPdf(req, res) {
    try {
      const rows = await fetchHistory(req.user.id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="fittrack_bilan.pdf"');

      const doc = new PDFDocument({ margin: 40 });
      doc.pipe(res);

      doc.fontSize(20).text('FitTrack — Bilan d\'entraînement', { align: 'center' });
      doc.moveDown();
      doc.fontSize(11).fillColor('#555').text(`Utilisateur : ${req.user.username}`, { align: 'center' });
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
      doc.moveDown(2);

      doc.fillColor('#000').fontSize(13).text(`${rows.length} séance(s) au total`);
      doc.moveDown();

      rows.forEach((r) => {
        doc.fontSize(12).fillColor('#1d4ed8').text(`${toDateStr(r.date)} — ${r.title}`);
        doc.fontSize(10).fillColor('#333');
        if (r.duration)  doc.text(`Durée : ${r.duration} min`);
        if (r.exercises) doc.text(`Exercices : ${r.exercises}`);
        if (r.notes)     doc.text(`Notes : ${r.notes}`);
        doc.moveDown();
      });

      doc.end();
    } catch (err) {
      console.error('ExportPdf error:', err);
      res.status(500).json({ error: 'Failed to export PDF.' });
    }
  },
};

module.exports = StatsController;
