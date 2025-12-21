/**
 * Universal Access Layer (UAL) - Core Interface Definitions
 * 
 * These interfaces define the standardized contract that all UAL-compliant
 * systems must implement, ensuring consistent access patterns across the organization.
 */

/**
 * System Type categories for organizational purposes
 */
export enum SystemType {
    DATABASE = 'database',
    REST_API = 'rest_api',
    FILE_SYSTEM = 'file_system',
    MESSAGE_QUEUE = 'message_queue',
    STREAMING = 'streaming',
    LEGACY = 'legacy',
    SAAS = 'saas',
    CRM = 'crm',
    CUSTOM = 'custom'
}

/**
 * System health status indicators
 */
export enum HealthStatus {
    HEALTHY = 'healthy',
    DEGRADED = 'degraded',
    UNHEALTHY = 'unhealthy',
    UNKNOWN = 'unknown'
}

/**
 * Access level types for permission management
 */
export enum AccessLevel {
    READ = 'read',
    WRITE = 'write',
    ADMIN = 'admin',
    NONE = 'none'
}

/**
 * Data quality indicators
 */
export interface DataQuality {
    score: number; // 0-100
    lastValidated: Date;
    issues: string[];
    completeness: number; // 0-100
    accuracy: number; // 0-100
}

/**
 * System health and monitoring information
 */
export interface UALHealthStatus {
    status: HealthStatus;
    lastChecked: Date;
    uptime: number; // seconds
    responseTime: number; // milliseconds
    errorRate: number; // percentage
    details?: string;
}

/**
 * Contact information for system support and ownership
 */
export interface ContactInfo {
    team: string;
    email: string;
    slack?: string;
    phone?: string;
    onCallSchedule?: string;
}

/**
 * System version and change tracking
 */
export interface VersionInfo {
    current: string;
    releaseDate: Date;
    deprecated?: boolean;
    deprecationDate?: Date;
    nextVersion?: {
        version: string;
        releaseDate: Date;
        breakingChanges: string[];
    };
}

/**
 * API endpoint definition
 */
export interface UALEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description: string;
    parameters?: EndpointParameter[];
    requestBody?: object;
    responseSchema?: object;
    examples?: EndpointExample[];
    authentication?: string[];
    rateLimit?: {
        requests: number;
        period: string; // e.g., "1m", "1h", "1d"
    };
}

/**
 * Endpoint parameter definition
 */
export interface EndpointParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    default?: any;
    enum?: any[];
}

/**
 * Example request/response for an endpoint
 */
export interface EndpointExample {
    name: string;
    description: string;
    request?: object;
    response: object;
}

/**
 * Data schema definition (for tables, files, etc.)
 */
export interface DataSchema {
    name: string;
    description: string;
    fields: SchemaField[];
    primaryKey?: string[];
    indexes?: string[][];
    relationships?: SchemaRelationship[];
}

/**
 * Individual field in a schema
 */
export interface SchemaField {
    name: string;
    type: string;
    nullable: boolean;
    description: string;
    constraints?: {
        unique?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string;
        enum?: any[];
    };
    businessDefinition?: string;
    piiFlag?: boolean;
    sampleValues?: any[];
}

/**
 * Relationship between schemas
 */
export interface SchemaRelationship {
    targetSchema: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    foreignKey: string;
    targetKey: string;
}

/**
 * Access control and permissions
 */
export interface UALAccessControl {
    currentUserAccess: AccessLevel;
    requiredPermissions: string[];
    requestAccessUrl?: string;
    accessPolicies: AccessPolicy[];
    auditLog?: boolean;
}

/**
 * Access policy definition
 */
export interface AccessPolicy {
    name: string;
    description: string;
    conditions: string[];
    grantedBy: string;
}

/**
 * Data catalog information
 */
export interface UALDataCatalog {
    datasets: DatasetInfo[];
    tags: string[];
    categories: string[];
    totalRecords?: number;
    dataRetention?: {
        policy: string;
        duration: string;
    };
}

/**
 * Individual dataset information
 */
export interface DatasetInfo {
    id: string;
    name: string;
    description: string;
    schema: DataSchema;
    location: string;
    format?: string;
    size?: number; // bytes
    recordCount?: number;
    lastUpdated: Date;
    updateFrequency?: string;
    quality: DataQuality;
    owner: string;
    tags: string[];
    sampleData?: any[];
}

/**
 * Documentation and support resources
 */
export interface Documentation {
    overview: string;
    gettingStarted?: string;
    apiReference?: string;
    examples?: DocumentationExample[];
    faq?: FAQItem[];
    troubleshooting?: string;
    changelog?: ChangelogEntry[];
}

/**
 * Documentation example
 */
export interface DocumentationExample {
    title: string;
    description: string;
    code: string;
    language: string;
}

/**
 * FAQ item
 */
export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Changelog entry
 */
export interface ChangelogEntry {
    version: string;
    date: Date;
    changes: string[];
    breaking: boolean;
}

/**
 * System metadata - additional information about the system
 */
export interface UALMetadata {
    systemId: string;
    systemName: string;
    displayName: string;
    type: SystemType;
    description: string;
    version: VersionInfo;
    owner: ContactInfo;
    documentation: Documentation;
    tags: string[];
    categories: string[];
    environment: 'production' | 'staging' | 'development' | 'test';
    region?: string;
    dataCenters?: string[];
    compliance?: string[]; // e.g., ['GDPR', 'HIPAA', 'SOC2']
    customMetadata?: Record<string, any>;
}

/**
 * Main UAL System Interface
 * 
 * Every system in the organization should implement this interface
 * to provide standardized access to both data and metadata.
 */
export interface UALSystem {
    /**
     * System metadata and general information
     */
    metadata: UALMetadata;

    /**
     * Health and monitoring status
     */
    health: UALHealthStatus;

    /**
     * Access control and permissions
     */
    accessControl: UALAccessControl;

    /**
     * Data catalog - what data is available
     */
    dataCatalog: UALDataCatalog;

    /**
     * Available API endpoints for interacting with the system
     */
    endpoints: UALEndpoint[];

    /**
     * Get system metadata
     */
    getMetadata(): Promise<UALMetadata>;

    /**
     * Get current health status
     */
    getHealth(): Promise<UALHealthStatus>;

    /**
     * Check if current user has access to a resource
     */
    checkAccess(resource: string, level: AccessLevel): Promise<boolean>;

    /**
     * Get available datasets
     */
    getDatasets(): Promise<DatasetInfo[]>;

    /**
     * Get schema for a specific dataset
     */
    getSchema(datasetId: string): Promise<DataSchema>;

    /**
     * Execute a query or operation (system-specific)
     */
    execute(operation: string, parameters?: any): Promise<any>;

    /**
     * Get sample data from a dataset
     */
    getSampleData(datasetId: string, limit?: number): Promise<any[]>;

    /**
     * Search across the system
     */
    search(query: string, filters?: any): Promise<any[]>;
}

/**
 * UAL Registry - Central registry of all UAL-compliant systems
 */
export interface UALRegistry {
    /**
     * Register a new system
     */
    registerSystem(system: UALSystem): void;

    /**
     * Get a system by ID
     */
    getSystem(systemId: string): UALSystem | undefined;

    /**
     * Get all registered systems
     */
    getAllSystems(): UALSystem[];

    /**
     * Search for systems
     */
    searchSystems(query: string, filters?: {
        type?: SystemType;
        tags?: string[];
        categories?: string[];
    }): UALSystem[];

    /**
     * Unregister a system
     */
    unregisterSystem(systemId: string): void;
}
