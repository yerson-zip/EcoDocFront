const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/+$/, '')

const KEYS = { staff: 'ecodoc_staff_token', client: 'ecodoc_client_token' }
const LOGIN_PATHS = { staff: '/admin/login', client: '/acceso' }

function storeFor(role) {
  return role === 'staff' ? window.localStorage : window.sessionStorage
}

export const session = {
  get(role) {
    try {
      return storeFor(role).getItem(KEYS[role])
    } catch {
      return null
    }
  },
  set(role, token) {
    try {
      storeFor(role).setItem(KEYS[role], token)
    } catch {
      return
    }
  },
  clear(role) {
    try {
      storeFor(role).removeItem(KEYS[role])
    } catch {
      return
    }
  },
}

export function clientEmail() {
  const token = session.get('client')
  if (!token) return ''
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(payload)).sub || ''
  } catch {
    return ''
  }
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function messageFrom(body) {
  const detail = body && body.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length) {
    const first = detail[0]
    const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : ''
    return field ? `Revisa el campo «${field}»` : 'Revisa los datos ingresados'
  }
  return 'Ocurrió un error inesperado'
}

async function request(role, path, { method = 'GET', json, form, query } = {}) {
  const headers = {}
  const token = role ? session.get(role) : null
  if (token) headers.Authorization = `Bearer ${token}`

  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    body = form
  }

  let url = BASE + path
  if (query) {
    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') params.set(key, value)
    })
    const text = params.toString()
    if (text) url += `?${text}`
  }

  let response
  try {
    response = await fetch(url, { method, headers, body })
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
  }

  if (response.status === 401 && role) {
    session.clear(role)
    window.location.assign(LOGIN_PATHS[role])
    throw new ApiError(401, 'Tu sesión venció. Vuelve a ingresar.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, messageFrom(data))
  return data
}

const verifying = new Map()

export function verifyLink(token) {
  if (!verifying.has(token)) {
    verifying.set(
      token,
      request(null, '/auth/client/verify', { method: 'POST', json: { token } }).then((result) => {
        session.set('client', result.access_token)
        return result
      }),
    )
  }
  return verifying.get(token)
}

export const api = {
  requestLink: (email) => request(null, '/auth/client/request-link', { method: 'POST', json: { email } }),

  portalDocuments: () => request('client', '/portal/documents'),
  portalDownload: (docId, version) =>
    request('client', `/portal/documents/${docId}/versions/${version}/download-link`, { method: 'POST' }),

  staffLogin: async (email, password) => {
    const result = await request(null, '/auth/staff/login', { method: 'POST', json: { email, password } })
    session.set('staff', result.access_token)
    return result
  },
  clients: (q) => request('staff', '/admin/clients', { query: { q } }),
  createClient: (nit, name) => request('staff', '/admin/clients', { method: 'POST', json: { nit, name } }),
  client: (id) => request('staff', `/admin/clients/${id}`),
  updateClient: (id, changes) => request('staff', `/admin/clients/${id}`, { method: 'PATCH', json: changes }),
  createContact: (clientId, email, name) =>
    request('staff', `/admin/clients/${clientId}/contacts`, { method: 'POST', json: { email, name } }),
  updateContact: (id, changes) => request('staff', `/admin/contacts/${id}`, { method: 'PATCH', json: changes }),
  clientDocuments: (id) => request('staff', `/admin/clients/${id}/documents`),
  uploadDocument: (clientId, form) =>
    request('staff', `/admin/clients/${clientId}/documents`, { method: 'POST', form }),
  addVersion: (docId, form) => request('staff', `/admin/documents/${docId}/versions`, { method: 'POST', form }),
  publish: (docId, version) =>
    request('staff', `/admin/documents/${docId}/versions/${version}/publish`, { method: 'POST' }),
  unpublish: (docId, version) =>
    request('staff', `/admin/documents/${docId}/versions/${version}/unpublish`, { method: 'POST' }),
  adminDownload: (docId, version) =>
    request('staff', `/admin/documents/${docId}/versions/${version}/download-link`, { method: 'POST' }),
  audit: (clientId) => request('staff', '/admin/audit', { query: { client_id: clientId, limit: 200 } }),
}
