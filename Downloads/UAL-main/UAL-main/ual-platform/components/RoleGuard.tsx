import { UserRole, Permission, hasPermission } from './rbac';

// Client-side component for protecting UI sections based on permissions
interface RequirePermissionProps {
    permission: Permission | Permission[];
    role: UserRole;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RequirePermission({ permission, role, children, fallback = null }: RequirePermissionProps) {
    const permissions = Array.isArray(permission) ? permission : [permission];
    const hasAccess = permissions.some(p => hasPermission(role, p));

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

// Component to show different content based on role
interface RoleBasedContentProps {
    role: UserRole;
    developer?: React.ReactNode;
    support?: React.ReactNode;
    productManager?: React.ReactNode;
    admin?: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleBasedContent({
    role,
    developer,
    support,
    productManager,
    admin,
    fallback = null
}: RoleBasedContentProps) {
    switch (role) {
        case UserRole.DEVELOPER:
            return <>{developer || fallback}</>;
        case UserRole.SUPPORT:
            return <>{support || fallback}</>;
        case UserRole.PRODUCT_MANAGER:
            return <>{productManager || fallback}</>;
        case UserRole.ADMIN:
            return <>{admin || fallback}</>;
        default:
            return <>{fallback}</>;
    }
}

// Hook to get permissions for current user
export function usePermissions(role: UserRole) {
    return {
        can: (permission: Permission) => hasPermission(role, permission),
        canAny: (permissions: Permission[]) => permissions.some(p => hasPermission(role, p)),
        canAll: (permissions: Permission[]) => permissions.every(p => hasPermission(role, p)),
    };
}
