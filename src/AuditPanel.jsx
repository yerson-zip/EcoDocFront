import { api } from './api'
import { Badge, EmptyState, Notice, Spinner } from './ui'
import { AUDIT_ACTIONS, formatDate, label } from './utils'
import { useLoad } from './useLoad'

export default function AuditPanel({ clientId, documents }) {
  const { data, error, loading } = useLoad(() => api.audit(clientId), [clientId])
  const codes = new Map((documents || []).map((doc) => [doc.id, doc.code]))

  if (loading && !data) return <Spinner />
  if (error) return <Notice kind="error">{error.message}</Notice>
  if (!data || data.length === 0) return <EmptyState title="Sin actividad registrada" />

  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Quién</th>
            <th>Acción</th>
            <th>Documento</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td className="muted">{formatDate(entry.created_at, true)}</td>
              <td>
                <Badge tone={entry.actor_type === 'staff' ? 'neutral' : 'info'}>
                  {entry.actor_type === 'staff' ? 'Equipo' : 'Cliente'}
                </Badge>{' '}
                <span className="small">{entry.actor_email}</span>
              </td>
              <td>{label(AUDIT_ACTIONS, entry.action)}</td>
              <td className="mono">
                {entry.document_id ? `${codes.get(entry.document_id) || `#${entry.document_id}`}${entry.version ? ` · v${entry.version}` : ''}` : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
