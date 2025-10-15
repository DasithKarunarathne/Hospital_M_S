const dayjs = require('dayjs');

const CANCEL_CUTOFF_HOURS = 12;

function isWithinCutoff(dateTime, now) {
  return dayjs(dateTime).diff(dayjs(now), 'hour', true) < CANCEL_CUTOFF_HOURS;
}

function canCancel(appointment, now = new Date()) {
  if (!appointment) {
    return { ok: false, reason: 'Appointment not found' };
  }

  if (appointment.status === 'CANCELLED') {
    return { ok: false, reason: 'Appointment already cancelled' };
  }

  if (isWithinCutoff(appointment.startsAt, now)) {
    return {
      ok: false,
      reason: `Cannot cancel within ${CANCEL_CUTOFF_HOURS} hours of appointment time`
    };
  }

  return { ok: true };
}

function canReschedule(appointment, newSlot, now = new Date()) {
  if (!appointment) {
    return { ok: false, reason: 'Appointment not found' };
  }

  if (!newSlot?.startsAt || !newSlot?.endsAt) {
    return { ok: false, reason: 'New slot is incomplete' };
  }

  if (isWithinCutoff(appointment.startsAt, now)) {
    return {
      ok: false,
      reason: `Cannot reschedule within ${CANCEL_CUTOFF_HOURS} hours of appointment time`
    };
  }

  if (!dayjs(newSlot.startsAt).isAfter(now)) {
    return { ok: false, reason: 'New slot must be in the future' };
  }

  if (!dayjs(newSlot.endsAt).isAfter(newSlot.startsAt)) {
    return { ok: false, reason: 'End time must be after start time' };
  }

  return { ok: true };
}

module.exports = {
  CANCEL_CUTOFF_HOURS,
  canCancel,
  canReschedule
};
