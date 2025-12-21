// Role-Based Access Control (RBAC) Types and Permissions

export enum UserRole {
    DEVELOPER = 'DEVELOPER',
    SUPPORT = 'SUPPORT',
    PRODUCT_MANAGER = 'PRODUCT_MANAGER',
    ADMIN = 'ADMIN',
}

export enum Permission {
    // System permissions
    VIEW_SYSTEMS = 'VIEW_SYSTEMS',
    EDIT_SYSTEMS = 'EDIT_SYSTEMS',
    DELETE_SYSTEMS = 'DELETE_SYSTEMS',

    // API permissions
    VIEW_APIS = 'VIEW_APIS',
    EDIT_API_DOCS = 'EDIT_API_DOCS',
    TEST_APIS = 'TEST_APIS',

    // CRM permissions
    VIEW_CRM = 'VIEW_CRM',
    EDIT_CRM = 'EDIT_CRM',
    DELETE_CRM = 'DELETE_CRM',

    // User management
    VIEW_USERS = 'VIEW_USERS',
    EDIT_USERS = 'EDIT_USERS',
    MANAGE_ROLES = 'MANAGE_ROLES',

    // Configuration
    VIEW_CONFIG = 'VIEW_CONFIG',
    EDIT_CONFIG = 'EDIT_CONFIG',

    // Audit
    VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
}

// Permission matrix - Define what each role can do
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.DEVELOPER]: [
        Permission.VIEW_SYSTEMS,
        Permission.EDIT_SYSTEMS, // Metadata only
        Permission.VIEW_APIS,
        Permission.EDIT_API_DOCS,
        Permission.TEST_APIS,
        Permission.VIEW_CONFIG,
    ],

    [UserRole.SUPPORT]: [
        Permission.VIEW_SYSTEMS,
        Permission.VIEW_APIS,
        Permission.VIEW_CRM,
        Permission.VIEW_CONFIG,
    ],

    [UserRole.PRODUCT_MANAGER]: [
        Permission.VIEW_SYSTEMS,
        Permission.EDIT_SYSTEMS, // Metadata only
        Permission.VIEW_APIS,
        Permission.EDIT_API_DOCS,
        Permission.VIEW_CRM,
        Permission.EDIT_CRM,
        Permission.VIEW_AUDIT_LOGS,
    ],

    [UserRole.ADMIN]: [
        // Full access to everything
        Permission.VIEW_SYSTEMS,
        Permission.EDIT_SYSTEMS,
        Permission.DELETE_SYSTEMS,
        Permission.VIEW_APIS,
        Permission.EDIT_API_DOCS,
        Permission.TEST_APIS,
        Permission.VIEW_CRM,
        Permission.EDIT_CRM,
        Permission.DELETE_CRM,
        Permission.VIEW_USERS,
        Permission.EDIT_USERS,
        Permission.MANAGE_ROLES,
        Permission.VIEW_CONFIG,
        Permission.EDIT_CONFIG,
        Permission.VIEW_AUDIT_LOGS,
    ],
};

// Helper function to check if a role has a permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role].includes(permission);
}

// Helper function to check multiple permissions
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

// Helper function to check if user has all permissions
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

// Get user-friendly role name
export function getRoleName(role: UserRole): string {
    const names: Record<UserRole, string> = {
        [UserRole.DEVELOPER]: 'Developer',
        [UserRole.SUPPORT]: 'Support / BAU',
        [UserRole.PRODUCT_MANAGER]: 'Product Manager',
        [UserRole.ADMIN]: 'Administrator',
    };
    return names[role];
}

// Get role description
export function getRoleDescription(role: UserRole): string {
    const descriptions: Record<UserRole, string> = {
        [UserRole.DEVELOPER]: 'Can view and edit API documentation, test endpoints, and update system metadata',
        [UserRole.SUPPORT]: 'Read-only access for troubleshooting and support purposes',
        [UserRole.PRODUCT_MANAGER]: 'Can manage API documentation, CRM data, and view analytics',
        [UserRole.ADMIN]: 'Full access to all platform features and user management',
    };
    return descriptions[role];
}

// Get role badge color
export function getRoleBadgeColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
        [UserRole.DEVELOPER]: '#6366f1', // Purple
        [UserRole.SUPPORT]: '#06b6d4',   // Cyan
        [UserRole.PRODUCT_MANAGER]: '#f472b6', // Pink
        [UserRole.ADMIN]: '#ef4444',     // Red
    };
    return colors[role];
}
