import { Link } from 'react-router-dom'

export function Logo({ to = '/', inverse = false }) {
  const tile = inverse ? '#E6F2EF' : '#0F5C4D'
  const leaf = inverse ? '#0F5C4D' : '#E6F2EF'
  return (
    <Link to={to} className="logo" aria-label="EcoDoc">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill={tile} />
        <path d="M9 21c0-6 4-10 13-11-.5 8-4 12-10 12-1 0-2.2-.3-3-1z" fill={leaf} />
        <path d="M9 24c2-5 5-8 9-10" stroke={tile} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
      <span>EcoDoc</span>
    </Link>
  )
}

export function Shell({ home = '/portal', nav, actions, children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Logo to={home} />
          <nav className="topnav" aria-label="Principal">
            {nav}
          </nav>
          <div className="topbar-actions">{actions}</div>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  )
}

export function Notice({ kind = 'info', children }) {
  return (
    <div className={`notice notice-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'error' ? <strong>Error: </strong> : null}
      {children}
    </div>
  )
}

export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Spinner({ text = 'Cargando…' }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner-dot" aria-hidden="true" />
      {text}
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
    </div>
  )
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3v10M6 9l4 4 4-4M4 17h12" />
    </svg>
  )
}

export function UploadIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13V3M6 7l4-4 4 4M4 17h12" />
    </svg>
  )
}

export function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 2.5h7l3.5 3.5v11a1 1 0 0 1-1 1h-9.5a1 1 0 0 1-1-1v-13.5a1 1 0 0 1 1-1z" />
      <path d="M12 2.5V6h3.5M7 10.5h6M7 13.5h4" />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7.5 8 5.5 8-5.5" />
    </svg>
  )
}
