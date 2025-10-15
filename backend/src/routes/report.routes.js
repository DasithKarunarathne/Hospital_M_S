const { Router } = require('express');
const controller = require('../controllers/report.controller');
const { requireAuth, attachUser } = require('../middleware/auth.middleware');

const router = Router();

router.get('/visits', requireAuth, attachUser, controller.getVisits);
router.get('/revenue', requireAuth, attachUser, controller.getRevenue);
router.get('/appointments', requireAuth, attachUser, controller.getAppointmentsStatus);
router.get('/export', requireAuth, attachUser, controller.exportReport);

module.exports = router;
