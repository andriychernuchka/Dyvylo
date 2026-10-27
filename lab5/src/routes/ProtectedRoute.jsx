import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated =
    localStorage.getItem('dyvylo_auth_status') === 'authenticated';

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
