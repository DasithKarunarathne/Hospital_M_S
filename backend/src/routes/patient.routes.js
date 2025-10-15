const { Router } = require('express');
const controller = require('../controllers/patient.controller');
const { requireAuth, attachUser } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { patientUpdateSchema } = require('../services/patients/validation.service');

const router = Router();

router.get('/:id', requireAuth, attachUser, controller.getById);
router.put('/:id', requireAuth, attachUser, validate(patientUpdateSchema), controller.update);
router.get('/:id/audit', requireAuth, attachUser, controller.getAudit);

module.exports = router;
