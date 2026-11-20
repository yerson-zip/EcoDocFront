import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api, session } from './api'
import AuthLayout from './AuthLayout'
import { Notice } from './ui'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (session.get('staff')) return <Navigate to="/admin" replace />

  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.staffLogin(email.trim(), password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout variant="staff">
      <div>
        <h1>Ingreso del equipo</h1>
        <p className="muted">Administra clientes y publica sus documentos.</p>
      </div>
      <form className="stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </AuthLayout>
  )
}
