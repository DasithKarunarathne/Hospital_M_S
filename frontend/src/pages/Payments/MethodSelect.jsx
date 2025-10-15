import { useState } from 'react'
import dayjs from 'dayjs'
import { insurancePaymentSchema, cardPaymentSchema } from '../../lib/validators.js'

const METHODS = [
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CARD', label: 'Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'GOVERNMENT', label: 'Government' }
]

export default function MethodSelect({ amount = 0, onSubmit }) {
  const [method, setMethod] = useState('INSURANCE')
  const [form, setForm] = useState({
    amount: amount || 100,
    provider: '',
    policyNo: '',
    validUntil: dayjs().add(1, 'year').format('YYYY-MM-DD')
  })
  const [error, setError] = useState(null)

  const handleMethodChange = (value) => {
    setMethod(value)
    setError(null)
  }

  const handleChange = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError(null)

    if (method === 'INSURANCE') {
      const result = insurancePaymentSchema.safeParse({
        provider: form.provider,
        policyNo: form.policyNo,
        validUntil: form.validUntil
      })

      if (!result.success) {
        setError(result.error.errors[0]?.message || 'Insurance details invalid')
        return
      }

      onSubmit?.({
        method,
        amount: Number(form.amount) || 0,
        details: {
          policy: result.data
        }
      })

      return
    }

    if (method === 'CARD') {
      const result = cardPaymentSchema.safeParse({ amount: form.amount })

      if (!result.success) {
        setError(result.error.errors[0]?.message || 'Amount invalid')
        return
      }

      onSubmit?.({
        method,
        amount: result.data.amount,
        details: {}
      })

      return
    }

    onSubmit?.({
      method,
      amount: method === 'GOVERNMENT' ? 0 : Number(form.amount) || 0,
      details: {}
    })
  }

  return (
    <form style={formStyles} onSubmit={handleSubmit}>
      <div style={methodsStyle}>
        {METHODS.map((item) => (
          <button
            type="button"
            key={item.value}
            style={methodButton(method === item.value)}
            onClick={() => handleMethodChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {method !== 'GOVERNMENT' ? (
        <label style={labelStyle}>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            style={inputStyle}
            value={form.amount}
            onChange={(event) => handleChange('amount', event.target.value)}
          />
        </label>
      ) : (
        <p style={infoText}>Government reimbursements are logged at $0.</p>
      )}

      {method === 'INSURANCE' ? (
        <div style={gridStyle}>
          <label style={labelStyle}>
            Provider
            <input
              style={inputStyle}
              value={form.provider}
              onChange={(event) => handleChange('provider', event.target.value)}
            />
          </label>
          <label style={labelStyle}>
            Policy number
            <input
              style={inputStyle}
              value={form.policyNo}
              onChange={(event) => handleChange('policyNo', event.target.value)}
            />
          </label>
          <label style={labelStyle}>
            Valid until
            <input
              type="date"
              style={inputStyle}
              value={form.validUntil}
              onChange={(event) => handleChange('validUntil', event.target.value)}
            />
          </label>
        </div>
      ) : null}

      {error ? <p style={errorStyle}>{error}</p> : null}

      <button type="submit" style={submitButton}>
        {method === 'CARD' ? 'Create payment intent' : 'Process payment'}
      </button>
    </form>
  )
}

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
}

const methodsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '0.75rem'
}

const methodButton = (active) => ({
  padding: '0.65rem 0.5rem',
  borderRadius: '0.85rem',
  border: active ? '2px solid #0ea5e9' : '1px solid #dbeafe',
  background: active ? 'rgba(14, 165, 233, 0.08)' : '#fff',
  cursor: 'pointer'
})

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
}

const inputStyle = {
  borderRadius: '0.75rem',
  border: '1px solid #dbeafe',
  padding: '0.5rem 0.75rem'
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem'
}

const infoText = {
  margin: 0,
  color: '#64748b'
}

const errorStyle = {
  color: '#ef4444',
  margin: 0
}

const submitButton = {
  alignSelf: 'flex-start',
  borderRadius: '9999px',
  border: 'none',
  padding: '0.6rem 1.5rem',
  background: '#0ea5e9',
  color: '#fff',
  cursor: 'pointer'
}
