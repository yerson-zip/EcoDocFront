import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import AccessPage from './AccessPage'
import AdminClientPage from './AdminClientPage'
import AdminClientsPage from './AdminClientsPage'
import AdminLoginPage from './AdminLoginPage'
import AdminShell from './AdminShell'
import PortalPage from './PortalPage'
import { session } from './api'

function RequireSession({ role, to }) {
  return session.get(role) ? <Outlet /> : <Navigate to={to} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portal" replace />} />
        <Route path="/acceso" element={<AccessPage />} />
        <Route element={<RequireSession role="client" to="/acceso" />}>
          <Route path="/portal" element={<PortalPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<RequireSession role="staff" to="/admin/login" />}>
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminClientsPage />} />
            <Route path="clientes/:id" element={<AdminClientPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
