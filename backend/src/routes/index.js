const { Router } = require('express')

const patientRoutes = require('./patient.routes')
const appointmentRoutes = require('./appointment.routes')
const paymentRoutes = require('./payment.routes')
const reportRoutes = require('./report.routes')

const router = Router()

router.use('/patients', patientRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/payments', paymentRoutes)
router.use('/reports', reportRoutes)

module.exports = router
