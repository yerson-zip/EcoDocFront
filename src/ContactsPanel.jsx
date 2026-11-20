import { useState } from 'react'
import { api } from './api'
import { Badge, EmptyState, Notice } from './ui'

export default function ContactsPanel({ client, onChanged }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function add(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api.createContact(client.id, email.trim(), name.trim())
      setEmail('')
      setName('')
      onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function toggle(contact) {
    setError('')
    try {
      await api.updateContact(contact.id, { is_active: !contact.is_active })
      onChanged()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stack">
      <form className="card stack" onSubmit={add}>
        <div>
          <h2>Agregar contacto</h2>
          <p className="muted small">
            Estas personas pueden entrar al portal con el correo registrado y recibirán un aviso cuando publiques documentos.
          </p>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="contact-email">Correo</label>
            <input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="contact-name">Nombre (opcional)</label>
            <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        {error ? <Notice kind="error">{error}</Notice> : null}
        <div className="form-actions">
          <button className="btn" type="submit" disabled={busy}>
            {busy ? 'Agregando…' : 'Agregar contacto'}
          </button>
        </div>
      </form>

      {client.contacts.length === 0 ? (
        <EmptyState title="Sin contactos">Agrega al menos uno para que el cliente pueda entrar.</EmptyState>
      ) : (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr>
                <th>Correo</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {client.contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.email}</td>
                  <td className="muted">{contact.name}</td>
                  <td>{contact.is_active ? <Badge tone="ok">Con acceso</Badge> : <Badge tone="draft">Sin acceso</Badge>}</td>
                  <td>
                    <button
                      className={`btn btn-small ${contact.is_active ? 'btn-danger' : 'btn-secondary'}`}
                      type="button"
                      onClick={() => toggle(contact)}
                    >
                      {contact.is_active ? 'Quitar acceso' : 'Restablecer acceso'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
