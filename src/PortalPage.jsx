import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, clientEmail, session } from './api'
import { Badge, DownloadIcon, EmptyState, Notice, Shell, Spinner } from './ui'
import { CATEGORIES, DOC_TYPES, SERVICES, formatBytes, formatDate, label, startDownload } from './utils'
import { useLoad } from './useLoad'

export default function PortalPage() {
  const navigate = useNavigate()
  const { data, error, loading } = useLoad(() => api.portalDocuments(), [])
  const [service, setService] = useState('')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState('')
  const [downloadError, setDownloadError] = useState('')

  const groups = useMemo(() => {
    const text = query.trim().toLowerCase()
    const filtered = (data || []).filter(
      (doc) =>
        (!service || doc.service === service) &&
        (!category || doc.category === category) &&
        (!text || doc.title.toLowerCase().includes(text) || doc.code.toLowerCase().includes(text)),
    )
    const byClient = new Map()
    filtered.forEach((doc) => {
      if (!byClient.has(doc.client_nit)) byClient.set(doc.client_nit, { name: doc.client_name, nit: doc.client_nit, docs: [] })
      byClient.get(doc.client_nit).docs.push(doc)
    })
    return [...byClient.values()]
  }, [data, service, category, query])

  function logout() {
    session.clear('client')
    navigate('/acceso', { replace: true })
  }

  async function download(docId, version) {
    const key = `${docId}-${version}`
    setBusy(key)
    setDownloadError('')
    try {
      startDownload(await api.portalDownload(docId, version))
    } catch (err) {
      setDownloadError(err.message)
    } finally {
      setBusy('')
    }
  }

  const actions = (
    <>
      <span>{clientEmail()}</span>
      <button className="btn btn-secondary btn-small" type="button" onClick={logout}>
        Salir
      </button>
    </>
  )

  const total = data ? data.length : 0

  return (
    <Shell actions={actions} nav={<Link to="/portal">Mis documentos</Link>}>
      <div className="page-head">
        <div>
          <h1>Mis documentos</h1>
          <p>Aquí encuentras los documentos que Grupo Gesecol ha publicado para ti. Puedes descargarlos cuando quieras.</p>
        </div>
      </div>

      {loading && !data ? <Spinner /> : null}
      {error ? <Notice kind="error">{error.message}</Notice> : null}
      {downloadError ? <Notice kind="error">{downloadError}</Notice> : null}

      {data && total > 0 ? (
        <div className="filters">
          <div className="field">
            <label htmlFor="q">Buscar</label>
            <input id="q" type="search" placeholder="Título o código" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="service">Servicio</label>
            <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
              <option value="">Todos</option>
              {Object.entries(SERVICES).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="category">Categoría</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Todas</option>
              {Object.entries(CATEGORIES).map(([value, text]) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      {data && total === 0 ? (
        <EmptyState title="Aún no tienes documentos publicados">
          Cuando el equipo de Gesecol publique uno, te llegará un aviso al correo y aparecerá aquí.
        </EmptyState>
      ) : null}

      {data && total > 0 && groups.length === 0 ? (
        <EmptyState title="Sin resultados">Prueba con otros filtros.</EmptyState>
      ) : null}

      {groups.map((group) => (
        <section className="stack" key={group.nit} aria-label={group.name}>
          <div className="group-title">
            <h2>{group.name}</h2>
            <span className="muted small">NIT {group.nit}</span>
          </div>
          {group.docs.map((doc) => {
            const versions = [...doc.versions].sort((a, b) => b.version - a.version)
            return (
              <article className="doc-card" key={doc.id}>
                <div className="doc-title">
                  <div>
                    <h3>{doc.title}</h3>
                    <span className="mono muted">{doc.code}</span>
                  </div>
                  <div className="badges">
                    <Badge>{label(SERVICES, doc.service)}</Badge>
                    <Badge tone="info">{label(DOC_TYPES, doc.doc_type)}</Badge>
                    <Badge>{label(CATEGORIES, doc.category)}</Badge>
                  </div>
                </div>
                <ul className="versions">
                  {versions.map((version, index) => {
                    const key = `${doc.id}-${version.version}`
                    return (
                      <li className="version" key={version.version}>
                        <div className="version-info">
                          <span>
                            Versión {version.version} {index === 0 ? <Badge tone="ok">Más reciente</Badge> : null}
                          </span>
                          <span className="muted small">
                            Publicada el {formatDate(version.published_at)} · {formatBytes(version.size_bytes)}
                          </span>
                        </div>
                        <div className="version-actions">
                          <button
                            className="btn btn-small"
                            type="button"
                            disabled={busy === key}
                            onClick={() => download(doc.id, version.version)}
                          >
                            <DownloadIcon />
                            {busy === key ? 'Preparando…' : 'Descargar'}
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </article>
            )
          })}
        </section>
      ))}
    </Shell>
  )
}
