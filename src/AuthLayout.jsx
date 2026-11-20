import { Badge, DownloadIcon, FileIcon, Logo } from './ui'

const HILLS = [
  { cx: 110, cy: 640, start: 34, step: 30, count: 15, seed: 0.4 },
  { cx: 560, cy: 70, start: 26, step: 27, count: 11, seed: 2.1 },
]

function ring(cx, cy, radius, seed) {
  const points = []
  for (let k = 0; k < 120; k += 1) {
    const t = (k / 120) * Math.PI * 2
    const r =
      radius *
      (1 + 0.1 * Math.sin(3 * t + seed) + 0.06 * Math.sin(5 * t + seed * 1.7) + 0.03 * Math.sin(9 * t + seed * 0.6))
    points.push(`${(cx + r * Math.cos(t)).toFixed(1)},${(cy + r * Math.sin(t) * 0.85).toFixed(1)}`)
  }
  return `M${points.join('L')}Z`
}

const RINGS = HILLS.flatMap((hill, h) =>
  Array.from({ length: hill.count }, (_, i) => ({
    key: `${h}-${i}`,
    d: ring(hill.cx, hill.cy, hill.start + i * hill.step, hill.seed + i * 0.18),
    strong: i % 4 === 0,
  })),
)

const COPY = {
  client: {
    home: '/portal',
    title: 'Tus documentos ambientales, siempre a mano',
    text: 'Consulta y descarga los conceptos, radicados y certificados que Grupo Gesecol publica para tu empresa.',
  },
  staff: {
    home: '/admin',
    title: 'Cada documento, con su versión y su historial',
    text: 'Sube archivos como borrador, revísalos y publícalos cuando estén listos. Cada descarga queda registrada.',
  },
}

function ClientPreview() {
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview-row">
        <span className="preview-file">
          <FileIcon />
        </span>
        <div className="preview-text">
          <strong>Concepto técnico RPCAEE</strong>
          <span>2026_900123456-1_RPCAEE_CONCEPTO_001</span>
        </div>
        <span className="preview-end preview-dl">
          <DownloadIcon />
        </span>
      </div>
      <div className="preview-row">
        <span className="preview-file">
          <FileIcon />
        </span>
        <div className="preview-text">
          <strong>Certificado de gestión</strong>
          <span>2026_900123456-1_RAEE_CERTIFICADO_002</span>
        </div>
        <span className="preview-end preview-dl">
          <DownloadIcon />
        </span>
      </div>
    </div>
  )
}

function StaffPreview() {
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview-row">
        <span className="preview-file">
          <FileIcon />
        </span>
        <div className="preview-text">
          <strong>Concepto técnico RPCAEE</strong>
          <span>Versión 2</span>
        </div>
        <span className="preview-end">
          <Badge tone="draft">Borrador</Badge>
        </span>
      </div>
      <div className="preview-row">
        <span className="preview-file">
          <FileIcon />
        </span>
        <div className="preview-text">
          <strong>Certificado de gestión</strong>
          <span>Versión 1</span>
        </div>
        <span className="preview-end">
          <Badge tone="ok">Publicada</Badge>
        </span>
      </div>
    </div>
  )
}

export default function AuthLayout({ variant = 'client', children }) {
  const copy = COPY[variant]
  return (
    <div className="auth-split">
      <main className="auth-main">
        <div className="auth-panel">{children}</div>
      </main>
      <aside className="auth-aside">
        <svg className="contours" viewBox="0 0 640 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {RINGS.map((item) => (
            <path key={item.key} d={item.d} fill="none" className={item.strong ? 'ring ring-strong' : 'ring'} />
          ))}
        </svg>
        <Logo to={copy.home} inverse />
        <div className="auth-pitch">
          <h2>{copy.title}</h2>
          <p>{copy.text}</p>
        </div>
        {variant === 'staff' ? <StaffPreview /> : <ClientPreview />}
      </aside>
    </div>
  )
}
