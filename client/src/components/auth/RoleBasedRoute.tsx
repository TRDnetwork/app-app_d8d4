import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

interface RoleBasedRouteProps {
  allowedRoles: string[];
  fallbackPath?: string;
}

export function RoleBasedRoute({ allowedRoles, fallbackPath = '/' }: RoleBasedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.user_metadata.role)) {
    return <Navigate to={fallbackPath} />;
  }

  return <Outlet />;
}
```

```typescript