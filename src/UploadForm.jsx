import { useState } from 'react'
import { api } from './api'
import { Notice, UploadIcon } from './ui'
import { ALLOWED_EXTENSIONS, CATEGORIES, DEFAULT_CATEGORY, DOC_TYPES, MAX_UPLOAD_MB, SERVICES, validateFile } from './utils'

export default function UploadForm({ clientId, onDone }) {
  const [title, setTitle] = useState('')
  const [service, setService] = useState('RPCAEE')
  const [docType, setDocType] = useState('CONCEPTO')
  const [category, setCategory] = useState(DEFAULT_CATEGORY.CONCEPTO)
  const [file, setFile] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function changeType(value) {
    setDocType(value)
    setCategory(DEFAULT_CATEGORY[value])
  }

  async function submit(event) {
    event.preventDefault()
    const problem = validateFile(file)
    if (problem) {
      setError(problem)
      return
    }
    setBusy(true)
    setError('')
    const form = new FormData()
    form.set('title', title.trim())
    form.set('service', service)
    form.set('doc_type', docType)
    form.set('category', category)
    form.set('file', file)
    try {
      await api.uploadDocument(clientId, form)
      setTitle('')
      setFile(null)
      setFileKey((value) => value + 1)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card stack" onSubmit={submit}>
      <div>
        <h2>Subir documento</h2>
        <p className="muted small">
          Se guarda como borrador. El cliente no lo ve hasta que publiques la versión. Formatos: {ALLOWED_EXTENSIONS.join(', ')}.
          Máximo {MAX_UPLOAD_MB} MB.
        </p>
      </div>
      <div className="form-grid">
        <div className="field" style={{ flexBasis: '100%' }}>
          <label htmlFor="title">Título</label>
          <input id="title" required maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="service">Servicio</label>
          <select id="service" value={service} onChange={(e) => setService(e.target.value)}>
            {Object.entries(SERVICES).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="docType">Tipo de documento</label>
          <select id="docType" value={docType} onChange={(e) => changeType(e.target.value)}>
            {Object.entries(DOC_TYPES).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.entries(CATEGORIES).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ flexBasis: '100%' }}>
          <label htmlFor="file">Archivo</label>
          <input
            key={fileKey}
            id="file"
            type="file"
            accept={ALLOWED_EXTENSIONS.join(',')}
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </div>
      </div>
      {error ? <Notice kind="error">{error}</Notice> : null}
      <div className="form-actions">
        <button className="btn" type="submit" disabled={busy}>
          <UploadIcon />
          {busy ? 'Subiendo…' : 'Subir como borrador'}
        </button>
      </div>
    </form>
  )
}
