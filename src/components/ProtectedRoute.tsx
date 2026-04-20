import { useAuth } from '../lib/auth';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from './ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'seller' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles = ['customer'] }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    toast({
      title: 'Access Denied',
      description: 'Please log in to continue.',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    toast({
      title: 'Unauthorized',
      description: 'You do not have permission to view this page.',
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;