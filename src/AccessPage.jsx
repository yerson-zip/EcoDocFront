import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { api, session, verifyLink } from './api'
import AuthLayout from './AuthLayout'
import { MailIcon, Notice, Spinner } from './ui'

export default function AccessPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [verifyError, setVerifyError] = useState('')

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    verifyLink(token)
      .then(() => {
        if (!cancelled) navigate('/portal', { replace: true })
      })
      .catch((err) => {
        if (!cancelled) setVerifyError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [token, navigate])

  if (!token && session.get('client')) return <Navigate to="/portal" replace />

  const verifying = Boolean(token) && !verifyError

  async function submit(event) {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      await api.requestLink(email.trim())
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  let content
  if (verifying) {
    content = (
      <>
        <h1>Validando tu enlace</h1>
        <Spinner text="Un momento…" />
      </>
    )
  } else if (sent) {
    content = (
      <div role="status" className="stack">
        <span className="sent-icon">
          <MailIcon />
        </span>
        <div>
          <h1>Revisa tu correo</h1>
          <p className="muted">
            Si <strong>{email.trim()}</strong> está registrado, te enviamos un enlace de acceso. Vence pronto y solo funciona
            una vez.
          </p>
        </div>
        <p className="muted small">
          ¿No llega? Revisa la carpeta de spam o{' '}
          <button className="btn-link" type="button" onClick={() => setSent(false)}>
            usa otro correo
          </button>
          .
        </p>
      </div>
    )
  } else {
    content = (
      <>
        <div>
          <h1>Ingresa a tu portal</h1>
          <p className="muted">Escribe tu correo y te enviamos un enlace de acceso. No necesitas contraseña.</p>
        </div>
        {verifyError ? <Notice kind="error">{verifyError} Pide uno nuevo con tu correo.</Notice> : null}
        <form className="stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nombre@empresa.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          {error ? <Notice kind="error">{error}</Notice> : null}
          <button className="btn" type="submit" disabled={sending}>
            {sending ? 'Enviando…' : 'Enviar enlace de acceso'}
          </button>
        </form>
      </>
    )
  }

  return <AuthLayout variant="client">{content}</AuthLayout>
}
