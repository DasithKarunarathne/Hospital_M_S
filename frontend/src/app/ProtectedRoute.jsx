import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store'

export default function ProtectedRoute({ roles, allowedRoles, children }) {
  const { token, user } = useAuthStore()
  const roleList = allowedRoles || roles

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roleList && !user) {
    return null
  }

  if (roleList && user && !roleList.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  if (children) {
    return children
  }

  return <Outlet />
}
