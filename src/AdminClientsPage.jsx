import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './api'
import { Badge, EmptyState, Notice, Spinner } from './ui'
import { formatDate } from './utils'
import { useLoad } from './useLoad'

export default function AdminClientsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [applied, setApplied] = useState('')
  const { data, error, loading } = useLoad(() => api.clients(applied), [applied])
  const [creating, setCreating] = useState(false)
  const [nit, setNit] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  async function create(event) {
    event.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const client = await api.createClient(nit.trim(), name.trim())
      navigate(`/admin/clientes/${client.id}`)
    } catch (err) {
      setFormError(err.message)
      setBusy(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Clientes</h1>
          <p>Cada cliente solo ve los documentos publicados a su nombre.</p>
        </div>
        <button className="btn" type="button" onClick={() => setCreating((value) => !value)}>
          {creating ? 'Cancelar' : 'Nuevo cliente'}
        </button>
      </div>

      {creating ? (
        <form className="card stack" onSubmit={create}>
          <h2>Nuevo cliente</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="nit">NIT (sin puntos, con guion si lleva dígito de verificación)</label>
              <input id="nit" required placeholder="900123456-1" value={nit} onChange={(e) => setNit(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="name">Razón social</label>
              <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          {formError ? <Notice kind="error">{formError}</Notice> : null}
          <div className="form-actions">
            <button className="btn" type="submit" disabled={busy}>
              {busy ? 'Creando…' : 'Crear cliente'}
            </button>
          </div>
        </form>
      ) : null}

      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault()
          setApplied(search.trim())
        }}
      >
        <div className="field">
          <label htmlFor="search">Buscar por nombre o NIT</label>
          <input id="search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-secondary" type="submit" style={{ alignSelf: 'flex-end' }}>
          Buscar
        </button>
      </form>

      {loading && !data ? <Spinner /> : null}
      {error ? <Notice kind="error">{error.message}</Notice> : null}

      {data && data.length === 0 ? (
        <EmptyState title="No hay clientes">Crea el primero con el botón «Nuevo cliente».</EmptyState>
      ) : null}

      {data && data.length > 0 ? (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Razón social</th>
                <th>NIT</th>
                <th>Estado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((client) => (
                <tr key={client.id}>
                  <td>
                    <Link to={`/admin/clientes/${client.id}`}>{client.name}</Link>
                  </td>
                  <td className="mono">{client.nit}</td>
                  <td>{client.is_active ? <Badge tone="ok">Activo</Badge> : <Badge tone="draft">Inactivo</Badge>}</td>
                  <td className="muted">{formatDate(client.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  )
}
