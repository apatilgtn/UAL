/**
 * Mock UAL Systems Data
 * 
 * This file creates mock system instances for the demo
 */

import { DatabaseConnector } from '../../ual-framework/connectors/database-connector';
import { APIConnector } from '../../ual-framework/connectors/api-connector';
import { FileConnector } from '../../ual-framework/connectors/file-connector';
import { CRMConnector } from '../../ual-framework/connectors/crm-connector';
import { UALSystem } from '../../ual-framework/core/interfaces';

// Create mock systems
const systems: UALSystem[] = [
    // Twenty CRM System
    new CRMConnector(
        'Twenty CRM',
        'http://localhost:3001/graphql',
        'Modern CRM system for managing contacts, companies, deals, and tasks'
    ),

    // Production Database
    new DatabaseConnector(
        'Customer DB',
        'Primary production database containing customer, order, and product data'
    ),

    // Legacy Database
    new DatabaseConnector(
        'Legacy CRM',
        'Legacy CRM system database - scheduled for migration'
    ),

    // REST APIs
    new APIConnector(
        'Customer API',
        'https://api.company.com',
        'RESTful API for customer data and operations'
    ),

    new APIConnector(
        'Payment Gateway',
        'https://payments.company.com',
        'Payment processing API with PCI-DSS compliance'
    ),

    new APIConnector(
        'Analytics API',
        'https://analytics.company.com',
        'Real-time analytics and reporting API'
    ),

    // File Systems
    new FileConnector(
        'Data Lake',
        '/data/lake',
        'Centralized data lake with daily batch files from various sources'
    ),

    new FileConnector(
        'FTP Feeds',
        '/feeds/incoming',
        'External data feeds from partners and vendors'
    ),
];

// Initialize health checks for all systems
systems.forEach(async (system) => {
    await system.getHealth();
});

export { systems };

export function getSystemById(id: string): UALSystem | undefined {
    return systems.find(s => s.metadata.systemId === id);
}

export function searchSystems(query: string): UALSystem[] {
    if (!query) return systems;

    const lowerQuery = query.toLowerCase();
    return systems.filter(system => {
        const matchesName = system.metadata.displayName.toLowerCase().includes(lowerQuery);
        const matchesDescription = system.metadata.description.toLowerCase().includes(lowerQuery);
        const matchesTags = system.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
        return matchesName || matchesDescription || matchesTags;
    });
}

export function getSystemsByType(type: string): UALSystem[] {
    return systems.filter(s => s.metadata.type === type);
}
