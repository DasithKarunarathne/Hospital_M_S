import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function RescheduleDialog({ open, appointment, onSubmit, onClose }) {
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  useEffect(() => {
    if (appointment) {
      setStartsAt(dayjs(appointment.startsAt).format('YYYY-MM-DDTHH:mm'))
      setEndsAt(dayjs(appointment.endsAt).format('YYYY-MM-DDTHH:mm'))
    }
  }, [appointment])

  if (!open) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.({
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString()
    })
  }

  return (
    <div style={backdrop}>
      <form style={dialog} onSubmit={handleSubmit}>
        <h3 style={title}>Reschedule appointment</h3>
        <p style={subtitle}>
          Current: {dayjs(appointment?.startsAt).format('MMM D, HH:mm')} →{' '}
          {dayjs(appointment?.endsAt).format('HH:mm')}
        </p>
        <label style={label}>
          New start
          <input
            type="datetime-local"
            style={input}
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            required
          />
        </label>
        <label style={label}>
          New end
          <input
            type="datetime-local"
            style={input}
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            required
          />
        </label>
        <div style={actions}>
          <button type="button" style={secondary} onClick={onClose}>
            Close
          </button>
          <button type="submit" style={primary}>
            Reschedule
          </button>
        </div>
      </form>
    </div>
  )
}

const backdrop = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const dialog = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '1rem',
  width: '420px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  boxShadow: '0 30px 60px rgba(15, 23, 42, 0.25)'
}

const title = {
  margin: 0
}

const subtitle = {
  margin: 0,
  color: '#64748b'
}

const label = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}

const input = {
  borderRadius: '0.75rem',
  border: '1px solid #dbeafe',
  padding: '0.5rem 0.75rem'
}

const actions = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '0.75rem'
}

const primary = {
  border: 'none',
  borderRadius: '9999px',
  padding: '0.5rem 1.5rem',
  background: '#0ea5e9',
  color: '#fff',
  cursor: 'pointer'
}

const secondary = {
  ...primary,
  background: '#e2e8f0',
  color: '#0f172a'
}
