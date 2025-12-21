/**
 * Database System UAL Connector
 * 
 * Example implementation of a UAL connector for database systems.
 * This demonstrates how to wrap a database with the UAL interface.
 */

import { BaseUALConnector } from '../core/base-connector';
import {
    SystemType,
    AccessLevel,
    DatasetInfo,
    DataSchema,
    SchemaField,
    UALEndpoint
} from '../core/interfaces';

export class DatabaseConnector extends BaseUALConnector {
    constructor(databaseName: string, description: string) {
        super({
            systemId: `db-${databaseName.toLowerCase().replace(/\s+/g, '-')}`,
            systemName: databaseName,
            displayName: `${databaseName} Database`,
            type: SystemType.DATABASE,
            description,
            version: {
                current: '1.0.0',
                releaseDate: new Date('2024-01-01')
            },
            owner: {
                team: 'Data Platform Team',
                email: 'data-platform@company.com',
                slack: '#data-platform'
            },
            documentation: {
                overview: `${databaseName} is a production database containing critical business data.`,
                gettingStarted: 'Connect using standard SQL drivers. Contact the Data Platform team for credentials.',
                apiReference: 'SQL query interface available through UAL execute() method.',
                examples: [
                    {
                        title: 'Simple Query',
                        description: 'Execute a SELECT query',
                        code: 'await connector.execute("SELECT", { table: "users", limit: 10 });',
                        language: 'javascript'
                    }
                ],
                faq: [
                    {
                        question: 'How do I get access?',
                        answer: 'Submit an access request through the IT portal.'
                    },
                    {
                        question: 'What is the data retention policy?',
                        answer: 'Data is retained for 7 years as per company policy.'
                    }
                ],
                changelog: []
            },
            tags: ['database', 'sql', 'production'],
            categories: ['data-storage', 'core-systems'],
            environment: 'production',
            region: 'us-east-1',
            compliance: ['SOC2', 'GDPR']
        });

        this.setupEndpoints();
        this.setupDataCatalog();
        this.setupAccessControl();
    }

    private setupEndpoints(): void {
        this.endpoints = [
            {
                path: '/query',
                method: 'POST',
                description: 'Execute a SQL query',
                parameters: [
                    {
                        name: 'query',
                        type: 'string',
                        required: true,
                        description: 'SQL query to execute'
                    },
                    {
                        name: 'limit',
                        type: 'number',
                        required: false,
                        description: 'Maximum number of rows to return',
                        default: 100
                    }
                ],
                requestBody: {
                    query: 'SELECT * FROM users WHERE active = true',
                    limit: 10
                },
                responseSchema: {
                    data: [],
                    rowCount: 0,
                    executionTime: 0
                },
                examples: [
                    {
                        name: 'Get active users',
                        description: 'Retrieve all active users',
                        request: {
                            query: 'SELECT * FROM users WHERE active = true',
                            limit: 10
                        },
                        response: {
                            data: [
                                { id: 1, name: 'John Doe', email: 'john@example.com', active: true }
                            ],
                            rowCount: 1,
                            executionTime: 45
                        }
                    }
                ],
                rateLimit: {
                    requests: 100,
                    period: '1m'
                }
            },
            {
                path: '/tables',
                method: 'GET',
                description: 'List all available tables',
                responseSchema: {
                    tables: []
                },
                examples: [
                    {
                        name: 'List tables',
                        description: 'Get all tables in the database',
                        response: {
                            tables: ['users', 'orders', 'products', 'transactions']
                        }
                    }
                ]
            },
            {
                path: '/schema/:table',
                method: 'GET',
                description: 'Get schema information for a table',
                parameters: [
                    {
                        name: 'table',
                        type: 'string',
                        required: true,
                        description: 'Table name'
                    }
                ],
                responseSchema: {
                    schema: {}
                }
            }
        ];
    }

    private setupDataCatalog(): void {
        // Example: Users table
        this.dataCatalog.datasets.push({
            id: 'users',
            name: 'Users',
            description: 'Customer and employee user accounts',
            schema: {
                name: 'users',
                description: 'User account information',
                fields: [
                    {
                        name: 'id',
                        type: 'integer',
                        nullable: false,
                        description: 'Unique user identifier',
                        constraints: { unique: true },
                        businessDefinition: 'Auto-incrementing primary key',
                        piiFlag: false,
                        sampleValues: [1, 2, 3]
                    },
                    {
                        name: 'email',
                        type: 'varchar(255)',
                        nullable: false,
                        description: 'User email address',
                        constraints: { unique: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
                        businessDefinition: 'Primary contact email',
                        piiFlag: true,
                        sampleValues: ['john@example.com', 'jane@example.com']
                    },
                    {
                        name: 'name',
                        type: 'varchar(100)',
                        nullable: false,
                        description: 'Full name',
                        businessDefinition: 'User\'s full legal name',
                        piiFlag: true,
                        sampleValues: ['John Doe', 'Jane Smith']
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        nullable: false,
                        description: 'Account creation timestamp',
                        businessDefinition: 'When the account was first created',
                        piiFlag: false,
                        sampleValues: ['2024-01-15T10:30:00Z', '2024-02-20T14:22:00Z']
                    },
                    {
                        name: 'active',
                        type: 'boolean',
                        nullable: false,
                        description: 'Account active status',
                        businessDefinition: 'Whether the account is currently active',
                        piiFlag: false,
                        sampleValues: [true, false]
                    }
                ],
                primaryKey: ['id'],
                indexes: [['email'], ['created_at']]
            },
            location: 'database://prod-db/public/users',
            format: 'PostgreSQL Table',
            recordCount: 125000,
            lastUpdated: new Date(),
            updateFrequency: 'Real-time',
            quality: {
                score: 95,
                lastValidated: new Date(),
                issues: ['2 records with missing email verification'],
                completeness: 98,
                accuracy: 95
            },
            owner: 'User Management Team',
            tags: ['users', 'authentication', 'pii'],
            sampleData: [
                { id: 1, email: 'john.doe@example.com', name: 'John Doe', created_at: '2024-01-15T10:30:00Z', active: true },
                { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith', created_at: '2024-02-20T14:22:00Z', active: true },
                { id: 3, email: 'bob.johnson@example.com', name: 'Bob Johnson', created_at: '2024-03-10T09:15:00Z', active: false }
            ]
        });

        // Example: Orders table
        this.dataCatalog.datasets.push({
            id: 'orders',
            name: 'Orders',
            description: 'Customer purchase orders',
            schema: {
                name: 'orders',
                description: 'Order transaction records',
                fields: [
                    {
                        name: 'order_id',
                        type: 'integer',
                        nullable: false,
                        description: 'Unique order identifier',
                        businessDefinition: 'Auto-incrementing order number',
                        piiFlag: false,
                        sampleValues: [1001, 1002, 1003]
                    },
                    {
                        name: 'user_id',
                        type: 'integer',
                        nullable: false,
                        description: 'Reference to user who placed the order',
                        businessDefinition: 'Foreign key to users table',
                        piiFlag: false,
                        sampleValues: [1, 2, 1]
                    },
                    {
                        name: 'total_amount',
                        type: 'decimal(10,2)',
                        nullable: false,
                        description: 'Total order value',
                        constraints: { min: 0 },
                        businessDefinition: 'Sum of all order items including tax',
                        piiFlag: false,
                        sampleValues: [99.99, 249.50, 1250.00]
                    },
                    {
                        name: 'status',
                        type: 'varchar(50)',
                        nullable: false,
                        description: 'Order status',
                        constraints: { enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                        businessDefinition: 'Current fulfillment status',
                        piiFlag: false,
                        sampleValues: ['pending', 'shipped', 'delivered']
                    },
                    {
                        name: 'order_date',
                        type: 'timestamp',
                        nullable: false,
                        description: 'When the order was placed',
                        businessDefinition: 'Timestamp of order creation',
                        piiFlag: false,
                        sampleValues: ['2024-06-01T10:30:00Z', '2024-06-02T14:22:00Z']
                    }
                ],
                primaryKey: ['order_id'],
                indexes: [['user_id'], ['order_date'], ['status']],
                relationships: [
                    {
                        targetSchema: 'users',
                        type: 'many-to-many',
                        foreignKey: 'user_id',
                        targetKey: 'id'
                    }
                ]
            },
            location: 'database://prod-db/public/orders',
            format: 'PostgreSQL Table',
            recordCount: 450000,
            lastUpdated: new Date(),
            updateFrequency: 'Real-time',
            quality: {
                score: 98,
                lastValidated: new Date(),
                issues: [],
                completeness: 100,
                accuracy: 98
            },
            owner: 'E-commerce Team',
            tags: ['orders', 'transactions', 'e-commerce'],
            sampleData: [
                { order_id: 1001, user_id: 1, total_amount: 99.99, status: 'delivered', order_date: '2024-06-01T10:30:00Z' },
                { order_id: 1002, user_id: 2, total_amount: 249.50, status: 'shipped', order_date: '2024-06-02T14:22:00Z' },
                { order_id: 1003, user_id: 1, total_amount: 1250.00, status: 'processing', order_date: '2024-06-03T09:15:00Z' }
            ]
        });

        this.dataCatalog.tags = ['production', 'sql', 'relational'];
        this.dataCatalog.categories = ['transactional-data', 'customer-data'];
        this.dataCatalog.totalRecords = 575000;
    }

    private setupAccessControl(): void {
        this.accessControl = {
            currentUserAccess: AccessLevel.READ,
            requiredPermissions: ['database.read', 'database.query'],
            requestAccessUrl: 'https://portal.company.com/access-requests',
            accessPolicies: [
                {
                    name: 'Read Access',
                    description: 'Allows SELECT queries on all tables',
                    conditions: ['User must be in data-analysts group', 'MFA enabled'],
                    grantedBy: 'Data Platform Team'
                },
                {
                    name: 'Write Access',
                    description: 'Allows INSERT, UPDATE, DELETE operations',
                    conditions: ['User must be in developers group', 'Production access approval required'],
                    grantedBy: 'Engineering Manager'
                }
            ],
            auditLog: true
        };
    }

    /**
     * Execute a database operation
     */
    async execute(operation: string, parameters?: any): Promise<any> {
        this.validateParameters(parameters || {}, ['table']);

        const { table, limit = 100, where } = parameters;

        // Simulate query execution
        await new Promise(resolve => setTimeout(resolve, 50));

        const dataset = this.dataCatalog.datasets.find(d => d.id === table);

        if (!dataset) {
            throw new Error(`Table '${table}' not found`);
        }

        // Return sample data
        let data = dataset.sampleData || [];

        if (where) {
            // Simple filtering simulation
            data = data.filter((row: any) => {
                return Object.entries(where).every(([key, value]) => row[key] === value);
            });
        }

        return {
            data: data.slice(0, limit),
            rowCount: data.length,
            executionTime: 45,
            query: `SELECT * FROM ${table}${where ? ' WHERE ' + JSON.stringify(where) : ''} LIMIT ${limit}`
        };
    }
}
