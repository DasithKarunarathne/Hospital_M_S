const dayjs = require('dayjs');
const Appointment = require('../../models/Appointment');

async function isSlotAvailable(doctorId, startsAt) {
  const count = await Appointment.countDocuments({
    doctorId,
    startsAt
  });

  return count === 0;
}

async function getAvailableSlots(doctorId, day) {
  if (!doctorId || !day) {
    return [];
  }

  const startOfDay = dayjs(day).startOf('day').add(9, 'hour');
  const endOfDay = dayjs(day).startOf('day').add(17, 'hour');

  const appointments = await Appointment.find({
    doctorId,
    startsAt: {
      $gte: startOfDay.toDate(),
      $lt: endOfDay.toDate()
    },
    status: { $ne: 'CANCELLED' }
  })
    .select('startsAt endsAt')
    .lean();

  const taken = new Set(appointments.map((appt) => dayjs(appt.startsAt).toISOString()));

  const slots = [];
  let cursor = startOfDay;

  while (cursor.isBefore(endOfDay)) {
    const slotStart = cursor;
    const slotEnd = cursor.add(30, 'minute');

    slots.push({
      startsAt: slotStart.toISOString(),
      endsAt: slotEnd.toISOString(),
      available: !taken.has(slotStart.toISOString())
    });

    cursor = slotEnd;
  }

  return slots;
}

module.exports = {
  isSlotAvailable,
  getAvailableSlots
};
