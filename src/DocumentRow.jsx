import { useState } from 'react'
import { api } from './api'
import { Badge, DownloadIcon, Notice, UploadIcon } from './ui'
import { CATEGORIES, DOC_TYPES, SERVICES, formatBytes, formatDate, label, startDownload, validateFile } from './utils'

export default function DocumentRow({ doc, onChanged }) {
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const versions = [...doc.versions].sort((a, b) => b.version - a.version)

  async function run(key, action) {
    setBusy(key)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  function publish(version) {
    const ok = window.confirm(
      `¿Publicar la versión ${version.version}? El cliente la verá de inmediato y recibirá un aviso por correo.`,
    )
    if (!ok) return
    run(`p${version.version}`, async () => {
      await api.publish(doc.id, version.version)
      onChanged()
    })
  }

  function unpublish(version) {
    const ok = window.confirm(`¿Retirar la versión ${version.version}? El cliente dejará de verla.`)
    if (!ok) return
    run(`u${version.version}`, async () => {
      await api.unpublish(doc.id, version.version)
      onChanged()
    })
  }

  function download(version) {
    run(`d${version.version}`, async () => {
      startDownload(await api.adminDownload(doc.id, version.version))
    })
  }

  function addVersion(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    const problem = validateFile(file)
    if (problem) {
      setError(problem)
      return
    }
    run('new', async () => {
      const form = new FormData()
      form.set('file', file)
      await api.addVersion(doc.id, form)
      onChanged()
    })
  }

  return (
    <article className="doc-card">
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
        {versions.map((version) => (
          <li className="version" key={version.version}>
            <div className="version-info">
              <span>
                Versión {version.version}{' '}
                {version.published_at ? <Badge tone="ok">Publicada</Badge> : <Badge tone="draft">Borrador</Badge>}
              </span>
              <span className="muted small">
                {version.original_filename} · {formatBytes(version.size_bytes)} · subida el {formatDate(version.created_at, true)}
                {version.published_at ? ` · publicada el ${formatDate(version.published_at, true)}` : ''}
              </span>
            </div>
            <div className="version-actions">
              <button
                className="btn btn-secondary btn-small"
                type="button"
                disabled={busy === `d${version.version}`}
                onClick={() => download(version)}
              >
                <DownloadIcon />
                Descargar
              </button>
              {version.published_at ? (
                <button
                  className="btn btn-danger btn-small"
                  type="button"
                  disabled={busy === `u${version.version}`}
                  onClick={() => unpublish(version)}
                >
                  Retirar
                </button>
              ) : (
                <button
                  className="btn btn-small"
                  type="button"
                  disabled={busy === `p${version.version}`}
                  onClick={() => publish(version)}
                >
                  Publicar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {error ? <Notice kind="error">{error}</Notice> : null}

      <div className="row">
        <label className="btn btn-secondary btn-small upload-label">
          <UploadIcon />
          {busy === 'new' ? 'Subiendo…' : 'Subir nueva versión'}
          <input type="file" onChange={addVersion} disabled={busy === 'new'} aria-label={`Subir nueva versión de ${doc.title}`} />
        </label>
      </div>
    </article>
  )
}
