import apiClient from '../../app/apiClient.js'
import { toastError, toastSuccess, toastWarning } from '../../app/toastHelpers.js'

export default function MockPspPanel({ payment, onEvent }) {
  if (!payment?.intentId) {
    return null
  }

  const trigger = async (status) => {
    try {
      await apiClient.post(
        '/payments/mock-psp/trigger',
        {
          intentId: payment.intentId,
          status
        },
        { skipErrorToast: true }
      )
      const message = `Intent ${status.toLowerCase()}`
      if (status === 'SUCCEEDED') {
        toastSuccess(message, 'Webhook delivered')
      } else {
        toastWarning(message, 'Webhook delivered')
      }
      onEvent?.(payment._id)
    } catch (err) {
      const message = err.response?.data?.message || 'Mock PSP call failed'
      toastError(message, 'Mock PSP')
    }
  }

  return (
    <section style={panel}>
      <h4 style={{ marginTop: 0 }}>Mock PSP</h4>
      <p style={{ marginTop: 0 }}>
        Use to simulate PSP callbacks for the card payment intent <code>{payment.intentId}</code>.
      </p>
      <div style={actions}>
        <button style={successButton} onClick={() => trigger('SUCCEEDED')}>
          Mark succeeded
        </button>
        <button style={failButton} onClick={() => trigger('FAILED')}>
          Mark failed
        </button>
      </div>
    </section>
  )
}

const panel = {
  background: '#fff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)'
}

const actions = {
  display: 'flex',
  gap: '1rem'
}

const successButton = {
  background: '#22c55e',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  padding: '0.5rem 1.25rem',
  cursor: 'pointer'
}

const failButton = {
  ...successButton,
  background: '#ef4444'
}
