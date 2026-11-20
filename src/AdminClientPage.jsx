import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from './api'
import AuditPanel from './AuditPanel'
import ContactsPanel from './ContactsPanel'
import DocumentRow from './DocumentRow'
import UploadForm from './UploadForm'
import { Badge, EmptyState, Notice, Spinner } from './ui'
import { useLoad } from './useLoad'

const TABS = [
  { id: 'docs', text: 'Documentos' },
  { id: 'contacts', text: 'Contactos' },
  { id: 'audit', text: 'Actividad' },
]

export default function AdminClientPage() {
  const { id } = useParams()
  const client = useLoad(() => api.client(id), [id])
  const docs = useLoad(() => api.clientDocuments(id), [id])
  const [tab, setTab] = useState('docs')
  const [error, setError] = useState('')

  async function toggleActive() {
    setError('')
    try {
      await api.updateClient(id, { is_active: !client.data.is_active })
      client.reload()
    } catch (err) {
      setError(err.message)
    }
  }

  if (client.loading && !client.data) return <Spinner />
  if (client.error && !client.data) return <Notice kind="error">{client.error.message}</Notice>
  if (!client.data) return null

  const current = client.data

  return (
    <>
      <div className="page-head">
        <div>
          <p className="small">
            <Link to="/admin">← Clientes</Link>
          </p>
          <h1>{current.name}</h1>
          <p>
            NIT <span className="mono">{current.nit}</span>{' '}
            {current.is_active ? <Badge tone="ok">Activo</Badge> : <Badge tone="draft">Inactivo</Badge>}
          </p>
        </div>
        <button className={`btn ${current.is_active ? 'btn-danger' : ''}`} type="button" onClick={toggleActive}>
          {current.is_active ? 'Desactivar cliente' : 'Reactivar cliente'}
        </button>
      </div>

      {error ? <Notice kind="error">{error}</Notice> : null}

      <div className="tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            className="tab"
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.text}
          </button>
        ))}
      </div>

      {tab === 'docs' ? (
        <div className="stack">
          <UploadForm clientId={id} onDone={docs.reload} />
          {docs.loading && !docs.data ? <Spinner /> : null}
          {docs.error ? <Notice kind="error">{docs.error.message}</Notice> : null}
          {docs.data && docs.data.length === 0 ? (
            <EmptyState title="Aún no hay documentos">Sube el primero con el formulario de arriba.</EmptyState>
          ) : null}
          {docs.data ? docs.data.map((doc) => <DocumentRow key={doc.id} doc={doc} onChanged={docs.reload} />) : null}
        </div>
      ) : null}

      {tab === 'contacts' ? <ContactsPanel client={current} onChanged={client.reload} /> : null}

      {tab === 'audit' ? <AuditPanel clientId={id} documents={docs.data} /> : null}
    </>
  )
}
