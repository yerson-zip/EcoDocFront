export const SERVICES = {
  RPCAEE: 'RPCAEE',
  RAEE: 'RAEE (posconsumo)',
  LLANTAS: 'Llantas',
  BATERIAS: 'Baterías',
  PGIRS: 'PGIRS',
  CONSULTORIA: 'Consultoría',
  SANCIONATORIO: 'Sancionatorio',
  OTRO: 'Otro',
}

export const DOC_TYPES = {
  DIAGNOSTICO: 'Diagnóstico',
  PROPUESTA: 'Propuesta',
  CONTRATO: 'Contrato',
  FACTURA: 'Factura',
  CONCEPTO: 'Concepto técnico',
  RADICADO: 'Radicado',
  ORDEN: 'Orden de servicio',
  MANIFIESTO: 'Manifiesto',
  PESAJE: 'Acta de pesaje',
  CERTIFICADO: 'Certificado',
  INFORME: 'Informe',
  OTRO: 'Otro',
}

export const CATEGORIES = {
  '01_COMERCIAL': 'Comercial',
  '02_CONTRATO_Y_FACTURACION': 'Contrato y facturación',
  '03_TECNICA': 'Técnica',
  '04_RADICADOS_Y_AUTORIDAD': 'Radicados y autoridad',
  '05_OPERACIONES_Y_TRAZABILIDAD': 'Operaciones y trazabilidad',
  '06_CERTIFICADOS_E_INFORMES': 'Certificados e informes',
  '07_POSVENTA_Y_CIERRE': 'Posventa y cierre',
}

export const DEFAULT_CATEGORY = {
  DIAGNOSTICO: '01_COMERCIAL',
  PROPUESTA: '01_COMERCIAL',
  CONTRATO: '02_CONTRATO_Y_FACTURACION',
  FACTURA: '02_CONTRATO_Y_FACTURACION',
  CONCEPTO: '03_TECNICA',
  RADICADO: '04_RADICADOS_Y_AUTORIDAD',
  ORDEN: '05_OPERACIONES_Y_TRAZABILIDAD',
  MANIFIESTO: '05_OPERACIONES_Y_TRAZABILIDAD',
  PESAJE: '05_OPERACIONES_Y_TRAZABILIDAD',
  CERTIFICADO: '06_CERTIFICADOS_E_INFORMES',
  INFORME: '06_CERTIFICADOS_E_INFORMES',
  OTRO: '07_POSVENTA_Y_CIERRE',
}

export const AUDIT_ACTIONS = {
  staff_login: 'Ingreso del equipo',
  staff_login_failed: 'Intento de ingreso fallido',
  link_requested: 'Enlace de acceso solicitado',
  client_login: 'Ingreso del cliente',
  upload: 'Documento subido',
  new_version: 'Nueva versión subida',
  publish: 'Versión publicada',
  unpublish: 'Versión retirada',
  download: 'Descarga',
  view: 'Consulta',
}

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.xlsx', '.pptx', '.png', '.jpg', '.jpeg', '.zip']
export const MAX_UPLOAD_MB = 25

export function label(map, key) {
  return map[key] ?? key
}

export function parseDate(value) {
  if (!value) return null
  const text = /Z$|[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value, withTime = false) {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    ...(withTime ? { timeStyle: 'short' } : {}),
    timeZone: 'America/Bogota',
  }).format(date)
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateFile(file) {
  if (!file) return 'Selecciona un archivo'
  const dot = file.name.lastIndexOf('.')
  const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : ''
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `Tipo de archivo no permitido. Usa: ${ALLOWED_EXTENSIONS.join(', ')}`
  }
  if (file.size === 0) return 'El archivo está vacío'
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `El archivo supera ${MAX_UPLOAD_MB} MB`
  return null
}

export function startDownload(link) {
  const anchor = document.createElement('a')
  anchor.href = link.url
  anchor.download = link.filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}
