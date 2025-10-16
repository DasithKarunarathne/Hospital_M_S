const asyncHandler = require('../utils/asyncHandler');
const patientService = require('../services/patients/patient.service');

const getById = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatient(req.params.id, req.user || {});
  res.status(200).json(patient);
});

const update = asyncHandler(async (req, res) => {
  const actorId = req.user?.id;
  const payload = req.validatedBody || req.body;
  const updated = await patientService.updatePatient(
    req.params.id,
    payload,
    actorId,
    req.expectedVersion
  );

  res.status(200).json(updated);
});

const getAudit = asyncHandler(async (req, res) => {
  const entries = await patientService.getAudit(req.params.id);
  res.status(200).json(entries);
});

module.exports = {
  getById,
  update,
  getAudit
};
