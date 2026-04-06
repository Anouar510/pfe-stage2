import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Si pas de token ou pas de rôle, rediriger vers login
  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // Si un rôle spécifique est requis et l'utilisateur ne l'a pas
  if (requiredRole && userRole !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'client') {
      return <Navigate to="/dashboard" replace />;
    } else {
      // Rôle inconnu, retour au login
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
