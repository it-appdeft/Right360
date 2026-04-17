import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin h-8 w-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
