/**
 * REST API System UAL Connector
 * 
 * Example implementation of a UAL connector for REST API systems.
 */

import { BaseUALConnector } from '../core/base-connector';
import {
    SystemType,
    AccessLevel,
    DatasetInfo
} from '../core/interfaces';

export class APIConnector extends BaseUALConnector {
    constructor(apiName: string, baseUrl: string, description: string) {
        super({
            systemId: `api-${apiName.toLowerCase().replace(/\s+/g, '-')}`,
            systemName: apiName,
            displayName: `${apiName} API`,
            type: SystemType.REST_API,
            description,
            version: {
                current: '2.1.0',
                releaseDate: new Date('2024-06-01'),
                nextVersion: {
                    version: '3.0.0',
                    releaseDate: new Date('2025-01-01'),
                    breakingChanges: [
                        'Authentication moved to OAuth 2.0',
                        'Pagination parameters renamed',
                        'Date format changed to ISO 8601'
                    ]
                }
            },
            owner: {
                team: 'API Platform Team',
                email: 'api-team@company.com',
                slack: '#api-platform',
                onCallSchedule: 'https://oncall.company.com/api-team'
            },
            documentation: {
                overview: `${apiName} provides RESTful endpoints for accessing business data and services.`,
                gettingStarted: 'Obtain an API key from the developer portal and include it in the X-API-Key header.',
                apiReference: `Full OpenAPI documentation available at ${baseUrl}/docs`,
                examples: [
                    {
                        title: 'Get User Profile',
                        description: 'Retrieve user profile information',
                        code: `fetch('${baseUrl}/v2/users/me', {
  headers: { 'X-API-Key': 'your-api-key' }
})`,
                        language: 'javascript'
                    },
                    {
                        title: 'Create Order',
                        description: 'Submit a new order',
                        code: `fetch('${baseUrl}/v2/orders', {
  method: 'POST',
  headers: { 
    'X-API-Key': 'your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    items: [{ product_id: 123, quantity: 2 }]
  })
})`,
                        language: 'javascript'
                    }
                ],
                faq: [
                    {
                        question: 'What is the rate limit?',
                        answer: 'Standard tier: 1000 requests/hour. Premium tier: 10000 requests/hour.'
                    },
                    {
                        question: 'How do I handle errors?',
                        answer: 'All errors return standard HTTP status codes with a JSON body containing error details.'
                    }
                ],
                changelog: [
                    {
                        version: '2.1.0',
                        date: new Date('2024-06-01'),
                        changes: [
                            'Added webhook support',
                            'Improved error messages',
                            'Added bulk operations endpoint'
                        ],
                        breaking: false
                    },
                    {
                        version: '2.0.0',
                        date: new Date('2024-01-15'),
                        changes: [
                            'New authentication system',
                            'Restructured response format',
                            'Deprecated v1 endpoints'
                        ],
                        breaking: true
                    }
                ]
            },
            tags: ['api', 'rest', 'production', 'customer-facing'],
            categories: ['integration', 'backend-services'],
            environment: 'production',
            region: 'global',
            compliance: ['SOC2', 'PCI-DSS']
        });

        this.baseUrl = baseUrl;
        this.setupEndpoints();
        this.setupDataCatalog();
        this.setupAccessControl();
    }

    private baseUrl: string;

    private setupEndpoints(): void {
        this.endpoints = [
            {
                path: '/v2/users',
                method: 'GET',
                description: 'List users with pagination',
                parameters: [
                    {
                        name: 'page',
                        type: 'integer',
                        required: false,
                        description: 'Page number',
                        default: 1
                    },
                    {
                        name: 'per_page',
                        type: 'integer',
                        required: false,
                        description: 'Items per page',
                        default: 20,
                        enum: [10, 20, 50, 100]
                    },
                    {
                        name: 'sort',
                        type: 'string',
                        required: false,
                        description: 'Sort field',
                        enum: ['created_at', 'name', 'email']
                    }
                ],
                responseSchema: {
                    data: [],
                    pagination: {
                        page: 1,
                        per_page: 20,
                        total: 0,
                        total_pages: 0
                    }
                },
                examples: [
                    {
                        name: 'Get first page',
                        description: 'Retrieve first 20 users',
                        response: {
                            data: [
                                { id: 1, name: 'John Doe', email: 'john@example.com' }
                            ],
                            pagination: { page: 1, per_page: 20, total: 1250, total_pages: 63 }
                        }
                    }
                ],
                authentication: ['API Key', 'OAuth 2.0'],
                rateLimit: {
                    requests: 1000,
                    period: '1h'
                }
            },
            {
                path: '/v2/users/:id',
                method: 'GET',
                description: 'Get a specific user by ID',
                parameters: [
                    {
                        name: 'id',
                        type: 'integer',
                        required: true,
                        description: 'User ID'
                    }
                ],
                responseSchema: {
                    id: 0,
                    name: '',
                    email: '',
                    created_at: ''
                },
                examples: [
                    {
                        name: 'Get user',
                        description: 'Retrieve user with ID 123',
                        response: {
                            id: 123,
                            name: 'John Doe',
                            email: 'john@example.com',
                            created_at: '2024-01-15T10:30:00Z'
                        }
                    }
                ]
            },
            {
                path: '/v2/orders',
                method: 'POST',
                description: 'Create a new order',
                requestBody: {
                    user_id: 0,
                    items: [
                        {
                            product_id: 0,
                            quantity: 0
                        }
                    ],
                    shipping_address: {}
                },
                responseSchema: {
                    order_id: 0,
                    status: '',
                    total: 0,
                    created_at: ''
                },
                examples: [
                    {
                        name: 'Create order',
                        description: 'Submit a new order',
                        request: {
                            user_id: 123,
                            items: [
                                { product_id: 456, quantity: 2 }
                            ]
                        },
                        response: {
                            order_id: 789,
                            status: 'pending',
                            total: 99.99,
                            created_at: '2024-06-15T14:22:00Z'
                        }
                    }
                ],
                authentication: ['API Key', 'OAuth 2.0']
            },
            {
                path: '/v2/products/search',
                method: 'GET',
                description: 'Search for products',
                parameters: [
                    {
                        name: 'q',
                        type: 'string',
                        required: true,
                        description: 'Search query'
                    },
                    {
                        name: 'category',
                        type: 'string',
                        required: false,
                        description: 'Filter by category'
                    }
                ],
                responseSchema: {
                    results: [],
                    total: 0
                }
            }
        ];
    }

    private setupDataCatalog(): void {
        this.dataCatalog.datasets.push({
            id: 'users-endpoint',
            name: 'Users API Endpoint',
            description: 'Access user data via REST API',
            schema: {
                name: 'User',
                description: 'User resource schema',
                fields: [
                    {
                        name: 'id',
                        type: 'integer',
                        nullable: false,
                        description: 'Unique user identifier',
                        piiFlag: false,
                        sampleValues: [1, 2, 3]
                    },
                    {
                        name: 'name',
                        type: 'string',
                        nullable: false,
                        description: 'User full name',
                        piiFlag: true,
                        sampleValues: ['John Doe', 'Jane Smith']
                    },
                    {
                        name: 'email',
                        type: 'string',
                        nullable: false,
                        description: 'User email address',
                        piiFlag: true,
                        sampleValues: ['john@example.com']
                    },
                    {
                        name: 'created_at',
                        type: 'string (ISO 8601)',
                        nullable: false,
                        description: 'Account creation timestamp',
                        piiFlag: false,
                        sampleValues: ['2024-01-15T10:30:00Z']
                    }
                ]
            },
            location: `${this.baseUrl}/v2/users`,
            format: 'JSON',
            lastUpdated: new Date(),
            updateFrequency: 'Real-time',
            quality: {
                score: 99,
                lastValidated: new Date(),
                issues: [],
                completeness: 100,
                accuracy: 99
            },
            owner: 'API Platform Team',
            tags: ['api', 'users', 'rest'],
            sampleData: [
                { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15T10:30:00Z' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-02-20T14:22:00Z' }
            ]
        });

        this.dataCatalog.tags = ['rest-api', 'json', 'production'];
        this.dataCatalog.categories = ['api-services', 'customer-facing'];
    }

    private setupAccessControl(): void {
        this.accessControl = {
            currentUserAccess: AccessLevel.READ,
            requiredPermissions: ['api.read'],
            requestAccessUrl: 'https://developer.company.com/access',
            accessPolicies: [
                {
                    name: 'API Key Access',
                    description: 'Standard API key authentication',
                    conditions: ['Valid API key required', 'Rate limits apply'],
                    grantedBy: 'Self-service via Developer Portal'
                },
                {
                    name: 'OAuth Access',
                    description: 'OAuth 2.0 authentication for user-context operations',
                    conditions: ['OAuth client credentials', 'User consent required'],
                    grantedBy: 'OAuth Provider'
                }
            ],
            auditLog: true
        };
    }

    /**
     * Execute an API operation
     */
    async execute(operation: string, parameters?: any): Promise<any> {
        const { endpoint, method = 'GET', body } = parameters || {};

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));

        // Return mock response based on endpoint
        if (endpoint === '/v2/users') {
            return {
                data: [
                    { id: 1, name: 'John Doe', email: 'john@example.com', created_at: '2024-01-15T10:30:00Z' },
                    { id: 2, name: 'Jane Smith', email: 'jane@example.com', created_at: '2024-02-20T14:22:00Z' }
                ],
                pagination: { page: 1, per_page: 20, total: 1250, total_pages: 63 }
            };
        }

        return {
            success: true,
            endpoint,
            method,
            timestamp: new Date().toISOString()
        };
    }
}
