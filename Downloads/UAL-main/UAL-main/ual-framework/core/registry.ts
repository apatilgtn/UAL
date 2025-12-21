/**
 * UAL Registry
 * 
 * Central registry for managing all UAL-compliant systems in the organization.
 * Provides discovery, search, and management capabilities.
 */

import { UALSystem, UALRegistry, SystemType } from './interfaces';

export class DefaultUALRegistry implements UALRegistry {
    private systems: Map<string, UALSystem> = new Map();

    /**
     * Register a new system
     */
    registerSystem(system: UALSystem): void {
        const systemId = system.metadata.systemId;

        if (this.systems.has(systemId)) {
            console.warn(`System '${systemId}' is already registered. Overwriting.`);
        }

        this.systems.set(systemId, system);
        console.log(`Registered UAL system: ${systemId} (${system.metadata.displayName})`);
    }

    /**
     * Get a system by ID
     */
    getSystem(systemId: string): UALSystem | undefined {
        return this.systems.get(systemId);
    }

    /**
     * Get all registered systems
     */
    getAllSystems(): UALSystem[] {
        return Array.from(this.systems.values());
    }

    /**
     * Search for systems with optional filters
     */
    searchSystems(query: string, filters?: {
        type?: SystemType;
        tags?: string[];
        categories?: string[];
    }): UALSystem[] {
        const lowerQuery = query.toLowerCase();

        return this.getAllSystems().filter(system => {
            // Text search
            const matchesQuery = !query ||
                system.metadata.systemName.toLowerCase().includes(lowerQuery) ||
                system.metadata.displayName.toLowerCase().includes(lowerQuery) ||
                system.metadata.description.toLowerCase().includes(lowerQuery);

            // Type filter
            const matchesType = !filters?.type || system.metadata.type === filters.type;

            // Tags filter
            const matchesTags = !filters?.tags ||
                filters.tags.some(tag => system.metadata.tags.includes(tag));

            // Categories filter
            const matchesCategories = !filters?.categories ||
                filters.categories.some(cat => system.metadata.categories.includes(cat));

            return matchesQuery && matchesType && matchesTags && matchesCategories;
        });
    }

    /**
     * Unregister a system
     */
    unregisterSystem(systemId: string): void {
        if (this.systems.delete(systemId)) {
            console.log(`Unregistered UAL system: ${systemId}`);
        } else {
            console.warn(`System '${systemId}' was not registered`);
        }
    }

    /**
     * Get systems by type
     */
    getSystemsByType(type: SystemType): UALSystem[] {
        return this.getAllSystems().filter(system => system.metadata.type === type);
    }

    /**
     * Get systems by environment
     */
    getSystemsByEnvironment(environment: 'production' | 'staging' | 'development' | 'test'): UALSystem[] {
        return this.getAllSystems().filter(system => system.metadata.environment === environment);
    }

    /**
     * Get system statistics
     */
    getStatistics(): {
        totalSystems: number;
        byType: Record<string, number>;
        byEnvironment: Record<string, number>;
        healthySystems: number;
        unhealthySystems: number;
    } {
        const systems = this.getAllSystems();

        const byType: Record<string, number> = {};
        const byEnvironment: Record<string, number> = {};
        let healthySystems = 0;
        let unhealthySystems = 0;

        systems.forEach(system => {
            // Count by type
            const type = system.metadata.type;
            byType[type] = (byType[type] || 0) + 1;

            // Count by environment
            const env = system.metadata.environment;
            byEnvironment[env] = (byEnvironment[env] || 0) + 1;

            // Count by health
            if (system.health.status === 'healthy') {
                healthySystems++;
            } else if (system.health.status === 'unhealthy') {
                unhealthySystems++;
            }
        });

        return {
            totalSystems: systems.length,
            byType,
            byEnvironment,
            healthySystems,
            unhealthySystems
        };
    }
}

// Global singleton registry instance
export const globalRegistry = new DefaultUALRegistry();
