const Payment = require('../../models/Payment');
const Appointment = require('../../models/Appointment');
const { authorizeInsurance } = require('./insurance.service');
const { createIntent, verifySignature } = require('./psp.mock');
const { issueReceipt } = require('./receipt.service');
const Receipt = require('../../models/Receipt');
const { badRequest, notFound, conflict, forbidden } = require('../../utils/httpErrors');

function normalizePatientId(value) {
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

function getLinkedPatientId(actor) {
  const linkedId = normalizePatientId(actor?.linkedPatientId);

  if (!linkedId) {
    throw forbidden('Your account is not linked to a patient record');
  }

  return linkedId;
}

async function ensureAppointment(appointmentId, actor) {
  const appointment = await Appointment.findById(appointmentId).lean();

  if (!appointment) {
    throw notFound('Appointment not found');
  }

  if (actor?.role === 'patient') {
    const linkedId = getLinkedPatientId(actor);

    if (normalizePatientId(appointment.patientId) !== linkedId) {
      throw forbidden('Patients may only manage payments for their own appointments');
    }
  }

  return appointment;
}

async function createPayment(payload, actor) {
  const { method, amount, appointmentId, details = {} } = payload;

  await ensureAppointment(appointmentId, actor);

  switch (method) {
    case 'INSURANCE': {
      const response = authorizeInsurance(details.policy, amount);

      if (!response.ok) {
        throw badRequest(response.reason || 'Insurance authorization failed');
      }

      const payment = await Payment.create({
        appointmentId,
        amount,
        method,
        status: 'SUCCESS',
        authCode: response.authCode,
        createdBy: actor?.id
      });

      const receipt = await issueReceipt(payment._id);

      return {
        payment: payment.toObject(),
        receipt
      };
    }
    case 'CARD': {
      const { intentId } = createIntent(amount);

      const payment = await Payment.create({
        appointmentId,
        amount,
        method,
        status: 'PENDING',
        intentId,
        createdBy: actor?.id
      });

      return {
        payment: payment.toObject()
      };
    }
    case 'CASH':
    case 'GOVERNMENT': {
      const effectiveAmount = method === 'GOVERNMENT' ? 0 : amount;
      const payment = await Payment.create({
        appointmentId,
        amount: effectiveAmount,
        method,
        status: 'SUCCESS',
        createdBy: actor?.id
      });

      const receipt = await issueReceipt(payment._id);

      return {
        payment: payment.toObject(),
        receipt
      };
    }
    default:
      throw badRequest('Unsupported payment method');
  }
}

async function handleWebhook(payload) {
  const { intentId, status, signature } = payload;

  if (!verifySignature(signature)) {
    throw forbidden('Invalid PSP signature');
  }

  if (!intentId) {
    throw badRequest('Missing intentId');
  }

  const payment = await Payment.findOne({ intentId });

  if (!payment) {
    throw notFound('Payment intent not recognised');
  }

  if (status === 'SUCCEEDED') {
    if (payment.status !== 'SUCCESS') {
      payment.status = 'SUCCESS';
      await payment.save();
      await issueReceipt(payment._id);
    }
  } else if (status === 'FAILED') {
    payment.status = 'FAILED';
    await payment.save();
  } else if (status === 'REFUNDED') {
    payment.status = 'REFUNDED';
    await payment.save();
  } else {
    throw badRequest('Unsupported webhook status');
  }

  return payment.toObject();
}

async function getReceipt(paymentId, actor) {
  const receipt = await Receipt.findOne({ paymentId }).lean();

  const payment = await Payment.findById(paymentId).lean();

  if (!payment) {
    throw notFound('Payment not found');
  }

  await ensureAppointment(payment.appointmentId, actor);

  if (receipt) {
    return receipt;
  }

  if (payment.status !== 'SUCCESS') {
    throw conflict('Receipt not available for non-successful payments');
  }

  return issueReceipt(paymentId);
}

module.exports = {
  createPayment,
  handleWebhook,
  getReceipt
};
