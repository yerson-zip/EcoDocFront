import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { session } from './api'
import { Shell } from './ui'

export default function AdminShell() {
  const navigate = useNavigate()

  function logout() {
    session.clear('staff')
    navigate('/admin/login', { replace: true })
  }

  return (
    <Shell
      home="/admin"
      nav={
        <NavLink to="/admin" end>
          Clientes
        </NavLink>
      }
      actions={
        <button className="btn btn-secondary btn-small" type="button" onClick={logout}>
          Salir
        </button>
      }
    >
      <Outlet />
    </Shell>
  )
}
