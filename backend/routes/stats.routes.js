const express          = require('express');
const router           = express.Router();
const StatsController  = require('../controllers/stats.controller');
const authMiddleware   = require('../middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Statistiques de l'utilisateur connecté (totaux, records, streak)
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Statistiques agrégées }
 */
router.get('/', StatsController.getStats);

/**
 * @openapi
 * /stats/export/csv:
 *   get:
 *     summary: Exporte l'historique des séances au format CSV
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Fichier CSV }
 */
router.get('/export/csv', StatsController.exportCsv);

/**
 * @openapi
 * /stats/export/pdf:
 *   get:
 *     summary: Exporte un bilan d'entraînement au format PDF
 *     tags: [Stats]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Fichier PDF }
 */
router.get('/export/pdf', StatsController.exportPdf);

module.exports = router;
