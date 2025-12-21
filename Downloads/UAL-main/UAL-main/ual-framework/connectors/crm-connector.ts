/**
 * CRM Connector for Twenty CRM
 * 
 * This connector provides UAL interface to Twenty CRM system
 * with contacts, companies, deals, and tasks management.
 */

import { BaseUALConnector } from '../core/base-connector';
import { SystemType, DatasetInfo, UALEndpoint, DataQuality, DataSchema } from '../core/interfaces';

export class CRMConnector extends BaseUALConnector {
    private crmName: string;
    private apiUrl: string;

    constructor(name: string, apiUrl: string = 'http://localhost:3001/graphql', description: string = 'Modern CRM system') {
        super({
            systemId: `crm-${name.toLowerCase().replace(/\s+/g, '-')}`,
            systemName: name,
            displayName: `${name}`,
            type: SystemType.CRM,
            description,
            version: {
                current: '1.0.0',
                releaseDate: new Date('2024-12-01')
            },
            owner: {
                team: 'Sales Operations Team',
                email: 'sales-ops@company.com',
                slack: '#sales-ops'
            },
            documentation: {
                overview: `${name} is a modern CRM system for managing customer relationships, sales pipeline, and business development activities.`,
                gettingStarted: 'Access the CRM through the UAL platform or directly via GraphQL API.',
                apiReference: 'GraphQL API for all CRM operations including contacts, companies, deals, and tasks.',
                examples: [
                    {
                        title: 'Query Contacts',
                        description: 'Fetch all contacts with pagination',
                        code: 'await connector.execute("getContacts", { limit: 10 });',
                        language: 'javascript'
                    }
                ],
                faq: [
                    {
                        question: 'How do I add a new contact?',
                        answer: 'Use the GraphQL createPerson mutation or the UAL execute method with "createContact" operation.'
                    },
                    {
                        question: 'Can I export CRM data?',
                        answer: 'Yes, you can export contacts, companies, and deals through the UAL data catalog.'
                    }
                ],
                changelog: []
            },
            tags: ['crm', 'contacts', 'sales', 'deals', 'tasks', 'pipeline'],
            categories: ['CRM', 'Sales', 'Customer Management'],
            environment: 'production',
            region: 'us-east-1',
            compliance: ['GDPR', 'SOC2']
        });

        this.crmName = name;
        this.apiUrl = apiUrl;
        this.initializeCRMData();
    }

    private initializeCRMData(): void {
        // Add CRM-specific tags
        this.metadata.tags.push('crm', 'contacts', 'sales', 'deals', 'tasks', 'pipeline');
        this.metadata.categories.push('CRM', 'Sales', 'Customer Management');

        // Define CRM datasets
        this.dataCatalog.datasets = [
            this.createContactsDataset(),
            this.createCompaniesDataset(),
            this.createDealsDataset(),
            this.createTasksDataset(),
        ];

        // Define CRM endpoints
        this.endpoints = this.createCRMEndpoints();
    }

    private createContactsDataset(): DatasetInfo {
        return {
            id: 'contacts',
            name: 'Contacts',
            description: 'Individual people/contacts in the CRM',
            schema: {
                name: 'contacts',
                description: 'Contact information schema',
                fields: [
                    { name: 'id', type: 'string', nullable: false, description: 'Unique contact identifier' },
                    { name: 'firstName', type: 'string', nullable: false, description: 'First name' },
                    { name: 'lastName', type: 'string', nullable: false, description: 'Last name' },
                    { name: 'email', type: 'string', nullable: true, description: 'Email address', piiFlag: true },
                    { name: 'phone', type: 'string', nullable: true, description: 'Phone number', piiFlag: true },
                    { name: 'company', type: 'string', nullable: true, description: 'Company name' },
                    { name: 'jobTitle', type: 'string', nullable: true, description: 'Job title' },
                    { name: 'status', type: 'string', nullable: false, description: 'Contact status (active, inactive)' },
                    { name: 'createdAt', type: 'datetime', nullable: false, description: 'Created timestamp' },
                    { name: 'updatedAt', type: 'datetime', nullable: false, description: 'Last updated timestamp' },
                ],
                primaryKey: ['id'],
            },
            location: `${this.apiUrl}/contacts`,
            format: 'GraphQL',
            recordCount: 247,
            lastUpdated: new Date(),
            updateFrequency: 'real-time',
            quality: this.generateQuality(95),
            owner: 'Sales Team',
            tags: ['contacts', 'people', 'pii'],
        };
    }

    private createCompaniesDataset(): DatasetInfo {
        return {
            id: 'companies',
            name: 'Companies',
            description: 'Organizations and companies in the CRM',
            schema: {
                name: 'companies',
                description: 'Company information schema',
                fields: [
                    { name: 'id', type: 'string', nullable: false, description: 'Unique company identifier' },
                    { name: 'name', type: 'string', nullable: false, description: 'Company name' },
                    { name: 'industry', type: 'string', nullable: true, description: 'Industry vertical' },
                    { name: 'size', type: 'string', nullable: true, description: 'Company size (employees)' },
                    { name: 'revenue', type: 'number', nullable: true, description: 'Annual revenue' },
                    { name: 'website', type: 'string', nullable: true, description: 'Company website' },
                    { name: 'address', type: 'string', nullable: true, description: 'Primary address' },
                    { name: 'createdAt', type: 'datetime', nullable: false, description: 'Created timestamp' },
                ],
                primaryKey: ['id'],
            },
            location: `${this.apiUrl}/companies`,
            format: 'GraphQL',
            recordCount: 89,
            lastUpdated: new Date(),
            updateFrequency: 'real-time',
            quality: this.generateQuality(92),
            owner: 'Sales Team',
            tags: ['companies', 'organizations'],
        };
    }

    private createDealsDataset(): DatasetInfo {
        return {
            id: 'deals',
            name: 'Deals',
            description: 'Sales opportunities and pipeline',
            schema: {
                name: 'deals',
                description: 'Deal/Opportunity information schema',
                fields: [
                    { name: 'id', type: 'string', nullable: false, description: 'Unique deal identifier' },
                    { name: 'title', type: 'string', nullable: false, description: 'Deal title' },
                    { name: 'value', type: 'number', nullable: false, description: 'Deal value in USD' },
                    { name: 'stage', type: 'string', nullable: false, description: 'Pipeline stage' },
                    { name: 'probability', type: 'number', nullable: true, description: 'Win probability (0-100)' },
                    { name: 'expectedCloseDate', type: 'date', nullable: true, description: 'Expected close date' },
                    { name: 'contactId', type: 'string', nullable: true, description: 'Primary contact' },
                    { name: 'companyId', type: 'string', nullable: true, description: 'Associated company' },
                    { name: 'ownerId', type: 'string', nullable: false, description: 'Deal owner (sales rep)' },
                    { name: 'createdAt', type: 'datetime', nullable: false, description: 'Created timestamp' },
                ],
                primaryKey: ['id'],
            },
            location: `${this.apiUrl}/deals`,
            format: 'GraphQL',
            recordCount: 156,
            lastUpdated: new Date(),
            updateFrequency: 'real-time',
            quality: this.generateQuality(88),
            owner: 'Sales Team',
            tags: ['deals', 'opportunities', 'pipeline', 'revenue'],
        };
    }

    private createTasksDataset(): DatasetInfo {
        return {
            id: 'tasks',
            name: 'Tasks',
            description: 'CRM tasks and activities',
            schema: {
                name: 'tasks',
                description: 'Task/Activity information schema',
                fields: [
                    { name: 'id', type: 'string', nullable: false, description: 'Unique task identifier' },
                    { name: 'title', type: 'string', nullable: false, description: 'Task title' },
                    { name: 'description', type: 'string', nullable: true, description: 'Task description' },
                    { name: 'type', type: 'string', nullable: false, description: 'Task type (call, email, meeting)' },
                    { name: 'status', type: 'string', nullable: false, description: 'Task status (pending, completed)' },
                    { name: 'priority', type: 'string', nullable: false, description: 'Priority (high, medium, low)' },
                    { name: 'dueDate', type: 'date', nullable: true, description: 'Due date' },
                    { name: 'assignedTo', type: 'string', nullable: false, description: 'Assigned user' },
                    { name: 'relatedTo', type: 'string', nullable: true, description: 'Related entity (contact, deal)' },
                    { name: 'createdAt', type: 'datetime', nullable: false, description: 'Created timestamp' },
                ],
                primaryKey: ['id'],
            },
            location: `${this.apiUrl}/tasks`,
            format: 'GraphQL',
            recordCount: 423,
            lastUpdated: new Date(),
            updateFrequency: 'real-time',
            quality: this.generateQuality(91),
            owner: 'Sales Team',
            tags: ['tasks', 'activities', 'follow-ups'],
        };
    }

    private createCRMEndpoints(): UALEndpoint[] {
        return [
            {
                path: '/graphql',
                method: 'POST',
                description: 'GraphQL API endpoint for all CRM operations',
                authentication: ['Bearer Token'],
                rateLimit: { requests: 1000, period: '1h' },
            },
            {
                path: '/api/contacts',
                method: 'GET',
                description: 'Get all contacts',
                authentication: ['Bearer Token'],
            },
            {
                path: '/api/companies',
                method: 'GET',
                description: 'Get all companies',
                authentication: ['Bearer Token'],
            },
            {
                path: '/api/deals',
                method: 'GET',
                description: 'Get all deals',
                authentication: ['Bearer Token'],
            },
            {
                path: '/api/tasks',
                method: 'GET',
                description: 'Get all tasks',
                authentication: ['Bearer Token'],
            },
        ];
    }

    private generateQuality(score: number): DataQuality {
        return {
            score,
            lastValidated: new Date(),
            issues: score < 90 ? ['Some records missing phone numbers', 'Duplicate email addresses detected'] : [],
            completeness: score,
            accuracy: score + 2,
        };
    }

    async execute(operation: string, parameters?: any): Promise<any> {
        // This would make actual GraphQL calls to Twenty CRM
        // For now, return mock response
        return {
            success: true,
            operation,
            parameters,
            message: 'CRM operation executed (mock)',
        };
    }

    async search(query: string, filters?: any): Promise<any[]> {
        // This would search across CRM entities
        return [];
    }
}
