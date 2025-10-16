import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RecordsPage from '../pages/Records/RecordsPage.jsx'
import AppointmentsPage from '../pages/Appointments/AppointmentsPage.jsx'
import PaymentsPage from '../pages/Payments/PaymentsPage.jsx'
import ReportsPage from '../pages/Reports/ReportsPage.jsx'
import LoginPage from '../pages/Auth/LoginPage.jsx'
import RegisterPage from '../pages/Auth/RegisterPage.jsx'
import Unauthorized from '../pages/Misc/Unauthorized.jsx'
import NotFound from '../pages/Misc/NotFound.jsx'
import Layout from '../components/Layout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleLandingRedirect from './RoleLandingRedirect.jsx'
import { Toasts } from './toasts.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<RoleLandingRedirect />} />

            <Route element={<ProtectedRoute allowedRoles={['doctor', 'staff', 'patient']} />}>
              <Route path="records/:id" element={<RecordsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['doctor', 'staff', 'patient']} />}>
              <Route path="appointments" element={<AppointmentsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['staff', 'patient', 'manager', 'admin']} />}>
              <Route path="payments" element={<Navigate to="/payments/demo" replace />} />
              <Route path="payments/:id" element={<PaymentsPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['doctor', 'staff', 'manager', 'admin']} />}>
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>

          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toasts />
    </BrowserRouter>
  )
}
