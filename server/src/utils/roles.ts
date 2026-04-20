// User roles
export enum UserRole {
  CUSTOMER = 'customer',
  SELLER = 'seller',
  ADMIN = 'admin',
}

// Role-based access control
export const hasRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.CUSTOMER]: 1,
    [UserRole.SELLER]: 2,
    [UserRole.ADMIN]: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Default role
export const DEFAULT_ROLE = process.env.DEFAULT_USER_ROLE as UserRole || UserRole.CUSTOMER;
```

```typescript
// SECURITY FIX: Use environment variables for email configuration