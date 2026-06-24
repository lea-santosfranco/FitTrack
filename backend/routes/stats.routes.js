const express          = require('express');
const router           = express.Router();
const StatsController  = require('../controllers/stats.controller');
const authMiddleware   = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', StatsController.getStats);

module.exports = router;
