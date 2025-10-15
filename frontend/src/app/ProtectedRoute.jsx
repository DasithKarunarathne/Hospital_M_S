import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store'

export default function ProtectedRoute({ roles }) {
  const { token, user } = useAuthStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
