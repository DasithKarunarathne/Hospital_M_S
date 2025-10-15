import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../../app/apiClient.js'
import MethodSelect from './MethodSelect.jsx'
import ReceiptView from './ReceiptView.jsx'
import MockPspPanel from './MockPspPanel.jsx'
import { toastError, toastSuccess, toastWarning } from '../../app/toastHelpers.js'

export default function PaymentsPage() {
  const { id } = useParams()
  const [payment, setPayment] = useState(null)
  const [receipt, setReceipt] = useState(null)

  const handlePayment = useCallback(
    async (payload) => {
      try {
        const { data } = await apiClient.post(
          '/payments',
          {
            ...payload,
            appointmentId: id
          },
          { skipErrorToast: true }
        )

        setPayment(data.payment)

        if (data.receipt) {
          setReceipt(data.receipt)
        }

        toastSuccess(`Method: ${data.payment.method}`, 'Payment processed')
      } catch (err) {
        const message = err.response?.data?.message || 'Payment failed'
        toastError(message, 'Payment error')
      }
    },
    [id]
  )

  const refreshReceipt = useCallback(async (paymentId) => {
    try {
      const { data } = await apiClient.get(`/payments/${paymentId}/receipt`, {
        skipErrorToast: true
      })
      setReceipt(data)
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to load receipt'
      toastWarning(message, 'Receipt unavailable')
    }
  }, [])

  return (
    <main style={layout}>
      <header>
        <h2 style={{ marginBottom: '0.5rem' }}>Payments</h2>
        <p style={{ color: '#64748b' }}>Collect payments and issue receipts for appointment {id}.</p>
      </header>
      <section style={grid}>
        <div style={card}>
          <h3 style={cardTitle}>Method</h3>
          <MethodSelect amount={payment?.amount} onSubmit={handlePayment} />
        </div>
        <div style={card}>
          <h3 style={cardTitle}>Receipt</h3>
          <ReceiptView payment={payment} receipt={receipt} onRefresh={refreshReceipt} />
        </div>
      </section>
      {payment?.method === 'CARD' ? <MockPspPanel payment={payment} onEvent={refreshReceipt} /> : null}
    </main>
  )
}

const layout = {
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem'
}

const card = {
  background: '#fff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)'
}

const cardTitle = {
  marginTop: 0
}
