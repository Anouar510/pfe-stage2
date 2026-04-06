import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Si l'utilisateur est déjà connecté, rediriger vers son dashboard
  if (token) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

export default PublicRoute;
