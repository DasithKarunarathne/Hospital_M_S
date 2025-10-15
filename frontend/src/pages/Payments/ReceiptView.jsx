import EmptyState from '../../components/EmptyState.jsx'
import { formatCurrency, formatDateTime } from '../../lib/formatters.js'

export default function ReceiptView({ payment, receipt, onRefresh }) {
  if (!payment) {
    return <EmptyState title="No payment yet" message="Process a payment to generate a receipt." />
  }

  if (payment.status !== 'SUCCESS') {
    return (
      <EmptyState
        title="Pending confirmation"
        message="Complete the payment flow to request a receipt."
      />
    )
  }

  if (!receipt) {
    return (
      <div style={placeholder}>
        <p>Receipt not generated yet.</p>
        <button style={buttonStyle} onClick={() => onRefresh?.(payment._id)}>
          Refresh receipt
        </button>
      </div>
    )
  }

  return (
    <article style={receiptCard}>
      <header style={receiptHeader}>
        <h4 style={receiptTitle}>Receipt {receipt.number}</h4>
        <span style={badge}>{formatDateTime(receipt.issuedAt)}</span>
      </header>
      <dl style={details}>
        <div style={row}>
          <dt>Payment ID</dt>
          <dd>{receipt.payload?.paymentId}</dd>
        </div>
        <div style={row}>
          <dt>Amount</dt>
          <dd>{formatCurrency(receipt.payload?.amount)}</dd>
        </div>
        <div style={row}>
          <dt>Method</dt>
          <dd>{receipt.payload?.method}</dd>
        </div>
        <div style={row}>
          <dt>Status</dt>
          <dd>{payment.status}</dd>
        </div>
      </dl>
    </article>
  )
}

const placeholder = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
}

const buttonStyle = {
  alignSelf: 'flex-start',
  background: '#0ea5e9',
  color: '#fff',
  border: 'none',
  borderRadius: '9999px',
  padding: '0.5rem 1.25rem',
  cursor: 'pointer'
}

const receiptCard = {
  border: '1px solid #e2e8f0',
  borderRadius: '0.85rem',
  padding: '1.25rem',
  background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.4), rgba(226, 232, 240, 0.1))'
}

const receiptHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const receiptTitle = {
  margin: 0
}

const badge = {
  borderRadius: '9999px',
  padding: '0.3rem 0.75rem',
  background: '#dbeafe',
  color: '#1d4ed8',
  fontSize: '0.8rem'
}

const details = {
  margin: '1.25rem 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
}

const row = {
  display: 'flex',
  justifyContent: 'space-between',
  color: '#475569'
}
