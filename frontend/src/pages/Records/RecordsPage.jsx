import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../../app/apiClient.js'
import ErrorBanner from '../../components/ErrorBanner.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import RecordEditForm from './RecordEditForm.jsx'
import ChangeLogPanel from './ChangeLogPanel.jsx'

export default function RecordsPage() {
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [auditEntries, setAuditEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAudit = useCallback(async () => {
    if (!id || id === 'preview') {
      setAuditEntries([])
      return
    }
    try {
      const { data } = await apiClient.get(`/patients/${id}/audit`)
      setAuditEntries(data)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  const loadPatient = useCallback(async () => {
    if (!id || id === 'preview') {
      setPatient(null)
      setAuditEntries([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [{ data: patientData }] = await Promise.all([
        apiClient.get(`/patients/${id}`)
      ])

      setPatient(patientData)
      await loadAudit()
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to load patient'
      setError(message)
      setPatient(null)
    } finally {
      setLoading(false)
    }
  }, [id, loadAudit])

  useEffect(() => {
    loadPatient()
  }, [loadPatient])

  const pageState = useMemo(() => {
    if (!id || id === 'preview') {
      return 'empty'
    }

    if (loading) {
      return 'loading'
    }

    if (error) {
      return 'error'
    }

    if (!patient) {
      return 'empty'
    }

    return 'ready'
  }, [id, loading, error, patient])

  if (pageState === 'empty') {
    return (
      <main style={layout}>
        <EmptyState
          title="Select a patient"
          message="Choose a record from the list to start reviewing."
        />
      </main>
    )
  }

  return (
    <main style={layout}>
      {error ? <ErrorBanner message={error} onRetry={loadPatient} /> : null}
      <div style={grid}>
        <section style={card}>
          <header style={cardHeader}>
            <div>
              <h2 style={cardTitle}>
                {patient?.demographics?.firstName} {patient?.demographics?.lastName}
              </h2>
              <p style={cardSubtitle}>Patient profile & insurance</p>
            </div>
          </header>
          <RecordEditForm
            patient={patient}
            loading={loading}
            onUpdated={(next) => {
              setPatient(next)
              loadAudit()
            }}
          />
        </section>
        <aside style={card}>
          <header style={cardHeader}>
            <div>
              <h3 style={cardTitle}>Change log</h3>
              <p style={cardSubtitle}>Recent updates and corrections</p>
            </div>
          </header>
          <ChangeLogPanel entries={auditEntries} loading={loading} />
        </aside>
      </div>
    </main>
  )
}

const layout = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
}

const grid = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: '1.5rem'
}

const card = {
  background: '#fff',
  borderRadius: '1rem',
  padding: '1.5rem',
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.08)',
  minHeight: '320px'
}

const cardHeader = {
  marginBottom: '1.5rem'
}

const cardTitle = {
  margin: 0
}

const cardSubtitle = {
  margin: 0,
  color: '#64748b'
}
