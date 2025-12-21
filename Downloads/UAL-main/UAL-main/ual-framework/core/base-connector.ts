/**
 * UAL Base Connector
 * 
 * Abstract base class that provides common functionality for all UAL connectors.
 * Extend this class to create connectors for specific system types.
 */

import {
    UALSystem,
    UALMetadata,
    UALHealthStatus,
    UALAccessControl,
    UALDataCatalog,
    UALEndpoint,
    DatasetInfo,
    DataSchema,
    AccessLevel,
    HealthStatus
} from './interfaces';

export abstract class BaseUALConnector implements UALSystem {
    // Core properties
    metadata: UALMetadata;
    health: UALHealthStatus;
    accessControl: UALAccessControl;
    dataCatalog: UALDataCatalog;
    endpoints: UALEndpoint[];

    constructor(metadata: UALMetadata) {
        this.metadata = metadata;

        // Initialize with default values
        this.health = {
            status: HealthStatus.UNKNOWN,
            lastChecked: new Date(),
            uptime: 0,
            responseTime: 0,
            errorRate: 0
        };

        this.accessControl = {
            currentUserAccess: AccessLevel.READ,
            requiredPermissions: [],
            accessPolicies: []
        };

        this.dataCatalog = {
            datasets: [],
            tags: [],
            categories: []
        };

        this.endpoints = [];
    }

    /**
     * Get system metadata
     */
    async getMetadata(): Promise<UALMetadata> {
        return this.metadata;
    }

    /**
     * Get current health status - should be overridden for real health checks
     */
    async getHealth(): Promise<UALHealthStatus> {
        try {
            const startTime = Date.now();
            await this.performHealthCheck();
            const responseTime = Date.now() - startTime;

            this.health = {
                status: HealthStatus.HEALTHY,
                lastChecked: new Date(),
                uptime: this.calculateUptime(),
                responseTime,
                errorRate: 0,
                details: 'System is operational'
            };
        } catch (error) {
            this.health = {
                status: HealthStatus.UNHEALTHY,
                lastChecked: new Date(),
                uptime: this.calculateUptime(),
                responseTime: 0,
                errorRate: 100,
                details: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        return this.health;
    }

    /**
     * Override this method to implement system-specific health checks
     */
    protected async performHealthCheck(): Promise<void> {
        // Default implementation - override in subclasses
        return Promise.resolve();
    }

    /**
     * Calculate system uptime (override for real implementation)
     */
    protected calculateUptime(): number {
        // Default: assume system is always up (in seconds)
        return 99999;
    }

    /**
     * Check if current user has access to a resource
     */
    async checkAccess(resource: string, level: AccessLevel): Promise<boolean> {
        // Default implementation - override with real authorization logic
        const userLevel = this.accessControl.currentUserAccess;

        const levelHierarchy: AccessLevel[] = [
            AccessLevel.NONE,
            AccessLevel.READ,
            AccessLevel.WRITE,
            AccessLevel.ADMIN
        ];

        const userLevelIndex = levelHierarchy.indexOf(userLevel);
        const requiredLevelIndex = levelHierarchy.indexOf(level);

        return userLevelIndex >= requiredLevelIndex;
    }

    /**
     * Get available datasets
     */
    async getDatasets(): Promise<DatasetInfo[]> {
        return this.dataCatalog.datasets;
    }

    /**
     * Get schema for a specific dataset
     */
    async getSchema(datasetId: string): Promise<DataSchema> {
        const dataset = this.dataCatalog.datasets.find(d => d.id === datasetId);

        if (!dataset) {
            throw new Error(`Dataset '${datasetId}' not found`);
        }

        return dataset.schema;
    }

    /**
     * Execute a query or operation - must be implemented by subclasses
     */
    abstract execute(operation: string, parameters?: any): Promise<any>;

    /**
     * Get sample data from a dataset
     */
    async getSampleData(datasetId: string, limit: number = 10): Promise<any[]> {
        const dataset = this.dataCatalog.datasets.find(d => d.id === datasetId);

        if (!dataset) {
            throw new Error(`Dataset '${datasetId}' not found`);
        }

        // Return sample data if available, otherwise empty array
        return dataset.sampleData?.slice(0, limit) || [];
    }

    /**
     * Search across the system - default implementation
     */
    async search(query: string, filters?: any): Promise<any[]> {
        // Default implementation: search dataset names and descriptions
        const lowerQuery = query.toLowerCase();

        return this.dataCatalog.datasets.filter(dataset => {
            const matchesName = dataset.name.toLowerCase().includes(lowerQuery);
            const matchesDescription = dataset.description.toLowerCase().includes(lowerQuery);
            const matchesTags = dataset.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

            return matchesName || matchesDescription || matchesTags;
        });
    }

    /**
     * Utility: Log operation for audit purposes
     */
    protected logOperation(operation: string, user: string, parameters?: any): void {
        if (this.accessControl.auditLog) {
            console.log(`[UAL Audit] ${new Date().toISOString()} - ${this.metadata.systemId} - ${user} - ${operation}`, parameters);
        }
    }

    /**
     * Utility: Validate required parameters
     */
    protected validateParameters(parameters: any, required: string[]): void {
        const missing = required.filter(param => !(param in parameters));

        if (missing.length > 0) {
            throw new Error(`Missing required parameters: ${missing.join(', ')}`);
        }
    }

    /**
     * Utility: Format error response
     */
    protected formatError(error: Error | string): { error: string; timestamp: Date } {
        return {
            error: error instanceof Error ? error.message : error,
            timestamp: new Date()
        };
    }
}
