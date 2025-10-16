function normalizeId(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.toString === 'function') {
    return value.toString();
  }

  return String(value);
}

function scopePatient(req, res, next) {
  if (!req.user) {
    res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required'
    });
    return;
  }

  if (req.user.role !== 'patient') {
    next();
    return;
  }

  const linkedId = normalizeId(req.user.linkedPatientId);

  if (!linkedId) {
    res.status(403).json({
      code: 'FORBIDDEN',
      message: 'Your account is not linked to a patient record'
    });
    return;
  }

  const requestedId = normalizeId(req.params.id);

  if (requestedId && requestedId === linkedId) {
    next();
    return;
  }

  res.status(403).json({
    code: 'FORBIDDEN',
    message: 'Patients may only access their own record'
  });
}

module.exports = {
  scopePatient
};
