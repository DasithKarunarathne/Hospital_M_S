const asyncHandler = require('../utils/asyncHandler');
const paymentService = require('../services/payments/payment.service');
const { createIntent } = require('../services/payments/psp.mock');
const env = require('../config/env');

const createPayment = asyncHandler(async (req, res) => {
  const actor = req.user || {};
  const result = await paymentService.createPayment(req.body, actor);

  res.status(result.receipt ? 201 : 202).json(result);
});

const handleWebhook = asyncHandler(async (req, res) => {
  await paymentService.handleWebhook({
    ...req.body,
    signature: req.headers['x-psp-signature']
  });

  res.status(200).json({ ok: true });
});

const getReceipt = asyncHandler(async (req, res) => {
  const receipt = await paymentService.getReceipt(req.params.id);
  res.status(200).json(receipt);
});

const createMockIntent = asyncHandler(async (req, res) => {
  const intent = createIntent(req.body.amount);
  res.status(200).json(intent);
});

const triggerMockWebhook = asyncHandler(async (req, res) => {
  const { intentId, status } = req.body;
  const response = await paymentService.handleWebhook({
    intentId,
    status,
    signature: env.PSP_WEBHOOK_SECRET
  });

  res.status(200).json(response);
});

module.exports = {
  createPayment,
  handleWebhook,
  getReceipt,
  createMockIntent,
  triggerMockWebhook
};
