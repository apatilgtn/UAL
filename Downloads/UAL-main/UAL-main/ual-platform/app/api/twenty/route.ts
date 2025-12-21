import { NextRequest, NextResponse } from 'next/server';

/**
 * Twenty CRM Schema Endpoint
 * Returns available GraphQL operations from Twenty CRM
 */

// Define the Twenty CRM API endpoints based on their GraphQL schema
const twentyEndpoints = [
    // People (Contacts)
    {
        id: 'twenty-get-people',
        name: 'Get People',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'GetPeople',
        description: 'Retrieve all people (contacts) from Twenty CRM',
        category: 'People',
        query: `query GetPeople {
  people {
    edges {
      node {
        id
        name {
          firstName
          lastName
        }
        emails {
          primaryEmail
        }
        phones {
          primaryPhoneNumber
        }
        city
        company {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                people: {
                    edges: [
                        {
                            node: {
                                id: 'abc123',
                                name: { firstName: 'John', lastName: 'Doe' },
                                emails: { primaryEmail: 'john@example.com' },
                                city: 'New York'
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'twenty-create-person',
        name: 'Create Person',
        method: 'POST',
        path: '/graphql',
        operation: 'mutation',
        operationName: 'CreatePerson',
        description: 'Create a new person (contact) in Twenty CRM',
        category: 'People',
        query: `mutation CreatePerson($data: PersonCreateInput!) {
  createPerson(data: $data) {
    id
    name {
      firstName
      lastName
    }
    emails {
      primaryEmail
    }
    createdAt
  }
}`,
        variables: {
            data: {
                name: {
                    firstName: 'Jane',
                    lastName: 'Smith'
                },
                emails: {
                    primaryEmail: 'jane@example.com'
                }
            }
        },
        sampleResponse: {
            data: {
                createPerson: {
                    id: 'new-person-id',
                    name: { firstName: 'Jane', lastName: 'Smith' },
                    emails: { primaryEmail: 'jane@example.com' }
                }
            }
        }
    },
    {
        id: 'twenty-delete-person',
        name: 'Delete Person',
        method: 'POST',
        path: '/graphql',
        operation: 'mutation',
        operationName: 'DeletePerson',
        description: 'Delete a person from Twenty CRM',
        category: 'People',
        query: `mutation DeletePerson($id: UUID!) {
  deletePerson(id: $id) {
    id
  }
}`,
        variables: {
            id: 'person-uuid-here'
        },
        sampleResponse: {
            data: {
                deletePerson: { id: 'deleted-person-id' }
            }
        }
    },

    // Companies
    {
        id: 'twenty-get-companies',
        name: 'Get Companies',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'GetCompanies',
        description: 'Retrieve all companies from Twenty CRM',
        category: 'Companies',
        query: `query GetCompanies {
  companies {
    edges {
      node {
        id
        name
        domainName {
          primaryLinkUrl
        }
        employees
        linkedinLink {
          primaryLinkUrl
        }
        address {
          addressStreet1
          addressCity
          addressState
          addressCountry
        }
        idealCustomerProfile
        createdAt
        updatedAt
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                companies: {
                    edges: [
                        {
                            node: {
                                id: 'comp123',
                                name: 'Acme Corp',
                                domainName: { primaryLinkUrl: 'acme.com' },
                                employees: 250
                            }
                        }
                    ]
                }
            }
        }
    },
    {
        id: 'twenty-create-company',
        name: 'Create Company',
        method: 'POST',
        path: '/graphql',
        operation: 'mutation',
        operationName: 'CreateCompany',
        description: 'Create a new company in Twenty CRM',
        category: 'Companies',
        query: `mutation CreateCompany($input: CompanyCreateInput!) {
  createCompany(data: $input) {
    id
    name
    domainName {
      primaryLinkUrl
    }
    employees
    createdAt
  }
}`,
        variables: {
            input: {
                name: 'New Company Inc',
                domainName: { primaryLinkUrl: 'newcompany.com' },
                employees: 50
            }
        },
        sampleResponse: {
            data: {
                createCompany: {
                    id: 'new-company-id',
                    name: 'New Company Inc',
                    employees: 50
                }
            }
        }
    },
    {
        id: 'twenty-delete-company',
        name: 'Delete Company',
        method: 'POST',
        path: '/graphql',
        operation: 'mutation',
        operationName: 'DeleteCompany',
        description: 'Delete a company from Twenty CRM',
        category: 'Companies',
        query: `mutation DeleteCompany($id: UUID!) {
  deleteCompany(id: $id) {
    id
  }
}`,
        variables: {
            id: 'company-uuid-here'
        },
        sampleResponse: {
            data: {
                deleteCompany: { id: 'deleted-company-id' }
            }
        }
    },

    // Opportunities (Deals)
    {
        id: 'twenty-get-opportunities',
        name: 'Get Opportunities',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'GetOpportunities',
        description: 'Retrieve all opportunities (deals) from Twenty CRM',
        category: 'Opportunities',
        query: `query GetOpportunities {
  opportunities {
    edges {
      node {
        id
        name
        amount {
          amountMicros
          currencyCode
        }
        stage
        closeDate
        probability
        company {
          id
          name
        }
        pointOfContact {
          id
          name {
            firstName
            lastName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                opportunities: {
                    edges: [
                        {
                            node: {
                                id: 'opp123',
                                name: 'Enterprise Deal',
                                amount: { amountMicros: 50000000000, currencyCode: 'USD' },
                                stage: 'NEGOTIATION'
                            }
                        }
                    ]
                }
            }
        }
    },

    // Tasks
    {
        id: 'twenty-get-tasks',
        name: 'Get Tasks',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'GetTasks',
        description: 'Retrieve all tasks from Twenty CRM',
        category: 'Tasks',
        query: `query GetTasks {
  tasks {
    edges {
      node {
        id
        title
        body
        status
        dueAt
        assignee {
          id
          name {
            firstName
            lastName
          }
        }
        createdAt
        updatedAt
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                tasks: {
                    edges: [
                        {
                            node: {
                                id: 'task123',
                                title: 'Follow up with client',
                                status: 'TODO',
                                dueAt: '2024-12-31'
                            }
                        }
                    ]
                }
            }
        }
    },

    // Notes
    {
        id: 'twenty-get-notes',
        name: 'Get Notes',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'GetNotes',
        description: 'Retrieve all notes from Twenty CRM',
        category: 'Notes',
        query: `query GetNotes {
  notes {
    edges {
      node {
        id
        title
        body
        createdAt
        updatedAt
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                notes: {
                    edges: [
                        {
                            node: {
                                id: 'note123',
                                title: 'Meeting notes',
                                body: 'Discussed Q4 targets...'
                            }
                        }
                    ]
                }
            }
        }
    },

    // Schema Introspection
    {
        id: 'twenty-introspection',
        name: 'Schema Introspection',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'IntrospectionQuery',
        description: 'Get the full GraphQL schema from Twenty CRM',
        category: 'System',
        query: `query IntrospectionQuery {
  __schema {
    queryType { name }
    mutationType { name }
    types {
      name
      kind
      description
      fields {
        name
        description
        type {
          name
          kind
        }
      }
    }
  }
}`,
        variables: {},
        sampleResponse: {
            data: {
                __schema: {
                    queryType: { name: 'Query' },
                    mutationType: { name: 'Mutation' },
                    types: [{ name: 'Person', kind: 'OBJECT' }]
                }
            }
        }
    },

    // Health Check
    {
        id: 'twenty-health',
        name: 'Health Check',
        method: 'POST',
        path: '/graphql',
        operation: 'query',
        operationName: 'HealthCheck',
        description: 'Check if Twenty CRM API is accessible',
        category: 'System',
        query: `query HealthCheck {
  __typename
}`,
        variables: {},
        sampleResponse: {
            data: {
                __typename: 'Query'
            }
        }
    }
];

export async function GET() {
    const isConfigured = !!(process.env.TWENTY_GRAPHQL_URL && process.env.TWENTY_API_KEY);

    return NextResponse.json({
        success: true,
        configured: isConfigured,
        graphqlUrl: process.env.TWENTY_GRAPHQL_URL || null,
        endpoints: twentyEndpoints,
        categories: ['People', 'Companies', 'Opportunities', 'Tasks', 'Notes', 'System'],
        totalEndpoints: twentyEndpoints.length,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { query, variables = {} } = body;

        if (!process.env.TWENTY_GRAPHQL_URL || !process.env.TWENTY_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Twenty CRM not configured',
            }, { status: 400 });
        }

        const startTime = Date.now();

        const response = await fetch(process.env.TWENTY_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TWENTY_API_KEY}`,
            },
            body: JSON.stringify({ query, variables }),
        });

        const data = await response.json();
        const responseTime = Date.now() - startTime;

        return NextResponse.json({
            success: true,
            status: response.status,
            data,
            responseTime,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to execute query',
        }, { status: 500 });
    }
}
