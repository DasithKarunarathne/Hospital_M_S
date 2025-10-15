const { Router } = require('express');
const controller = require('../controllers/payment.controller');
const { requireAuth, attachUser } = require('../middleware/auth.middleware');

const router = Router();

router.post('/', requireAuth, attachUser, controller.createPayment);
router.post('/webhook', controller.handleWebhook);
router.get('/:id/receipt', requireAuth, attachUser, controller.getReceipt);

router.post('/mock-psp/create-intent', controller.createMockIntent);
router.post('/mock-psp/trigger', controller.triggerMockWebhook);

module.exports = router;
