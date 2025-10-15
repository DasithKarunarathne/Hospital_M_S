const { Router } = require('express');
const controller = require('../controllers/appointment.controller');
const { requireAuth, attachUser } = require('../middleware/auth.middleware');

const router = Router();

router.get('/policy', requireAuth, attachUser, controller.getPolicy);
router.get('/:doctorId/slots', requireAuth, attachUser, controller.getAvailableSlots);
router.get('/', requireAuth, attachUser, controller.list);
router.post('/', requireAuth, attachUser, controller.book);
router.patch('/:id/cancel', requireAuth, attachUser, controller.cancel);
router.patch('/:id/reschedule', requireAuth, attachUser, controller.reschedule);

module.exports = router;
