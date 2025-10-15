const Appointment = require('../../models/Appointment');
const AuditEntry = require('../../models/AuditEntry');
const { isSlotAvailable } = require('./availability.service');
const { canCancel, canReschedule } = require('./policy.service');
const { conflict, notFound, badRequest } = require('../../utils/httpErrors');

async function logAudit(entityId, actorId, action, diff = []) {
  await AuditEntry.create({
    entity: 'Appointment',
    entityId,
    actorId,
    action,
    diff
  });
}

function ensureDate(value, field) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.valueOf())) {
    throw badRequest(`${field} must be a valid date`);
  }

  return date;
}

async function book(payload, actorId) {
  const { patientId, doctorId, reason } = payload;
  const startsAt = ensureDate(payload.startsAt, 'startsAt');
  const endsAt = ensureDate(payload.endsAt, 'endsAt');

  const available = await isSlotAvailable(doctorId, startsAt);

  if (!available) {
    throw conflict('Selected time slot is no longer available');
  }

  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      department: payload.department,
      startsAt,
      endsAt,
      status: 'BOOKED',
      notes: reason,
      createdBy: actorId
    });

    await logAudit(appointment._id, actorId, 'booked', [
      { path: 'status', before: null, after: appointment.status }
    ]);

    return appointment.toObject();
  } catch (error) {
    if (error.code === 11000) {
      throw conflict('Selected time slot is already booked');
    }

    throw error;
  }
}

async function cancel(id, actorId) {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw notFound('Appointment not found');
  }

  const policy = canCancel(appointment, new Date());

  if (!policy.ok) {
    throw badRequest(policy.reason);
  }

  const previousStatus = appointment.status;
  appointment.status = 'CANCELLED';
  appointment.updatedBy = actorId;

  await appointment.save();

  await logAudit(appointment._id, actorId, 'cancelled', [
    { path: 'status', before: previousStatus, after: appointment.status }
  ]);

  return appointment.toObject();
}

async function reschedule(id, newSlot, actorId) {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw notFound('Appointment not found');
  }

  const policy = canReschedule(appointment, newSlot, new Date());

  if (!policy.ok) {
    throw badRequest(policy.reason);
  }

  const startsAt = ensureDate(newSlot.startsAt, 'startsAt');
  const endsAt = ensureDate(newSlot.endsAt, 'endsAt');

  const available = await isSlotAvailable(appointment.doctorId, startsAt);

  if (!available) {
    throw conflict('Requested slot is unavailable');
  }

  const previous = {
    startsAt: appointment.startsAt,
    endsAt: appointment.endsAt,
    status: appointment.status
  };

  appointment.startsAt = startsAt;
  appointment.endsAt = endsAt;
  appointment.status = 'RESCHEDULED';
  appointment.updatedBy = actorId;

  await appointment.save();

  await logAudit(appointment._id, actorId, 'rescheduled', [
    { path: 'startsAt', before: previous.startsAt, after: appointment.startsAt },
    { path: 'endsAt', before: previous.endsAt, after: appointment.endsAt },
    { path: 'status', before: previous.status, after: appointment.status }
  ]);

  return appointment.toObject();
}

async function listUpcoming(limit = 20) {
  return Appointment.find({
    startsAt: { $gte: new Date() }
  })
    .sort({ startsAt: 1 })
    .limit(limit)
    .lean();
}

module.exports = {
  book,
  cancel,
  reschedule,
  listUpcoming
};
