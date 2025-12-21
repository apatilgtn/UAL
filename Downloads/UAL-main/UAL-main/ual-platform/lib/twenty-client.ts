import { GraphQLClient } from 'graphql-request';

/**
 * Twenty CRM GraphQL Client
 * Provides typed methods to interact with Twenty CRM API
 */

// Initialize GraphQL client
const createTwentyClient = () => {
  if (!process.env.TWENTY_GRAPHQL_URL || !process.env.TWENTY_API_KEY) {
    throw new Error('Twenty CRM credentials not configured. Please set TWENTY_GRAPHQL_URL and TWENTY_API_KEY in .env.local');
  }

  return new GraphQLClient(process.env.TWENTY_GRAPHQL_URL, {
    headers: {
      Authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
};

// Singleton instance
let twentyClient: GraphQLClient | null = null;

export const getTwentyClient = () => {
  if (!twentyClient) {
    twentyClient = createTwentyClient();
  }
  return twentyClient;
};

// ==================== PEOPLE (CONTACTS) ====================

export interface TwentyPerson {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getPeople(): Promise<TwentyPerson[]> {
  const client = getTwentyClient();

  const query = `
    query GetPeople {
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
    }
  `;

  try {
    const data: any = await client.request(query);
    return data.people.edges.map((edge: any) => ({
      id: edge.node.id,
      firstName: edge.node.name?.firstName || '',
      lastName: edge.node.name?.lastName || '',
      email: edge.node.emails?.primaryEmail || '',
      phone: edge.node.phones?.primaryPhoneNumber || '',
      jobTitle: edge.node.city || '', // Using city as placeholder
      company: edge.node.company,
      createdAt: edge.node.createdAt,
      updatedAt: edge.node.updatedAt,
    }));
  } catch (error) {
    console.error('[Twenty CRM] Error fetching people:', error);
    throw new Error('Failed to fetch contacts from Twenty CRM');
  }
}

export async function getPersonById(personId: string): Promise<TwentyPerson> {
  const client = getTwentyClient();

  const query = `
    query GetPerson($id: ID!) {
      person(id: $id) {
        id
        name {
          firstName
          lastName
        }
        email
        phone
        jobTitle
        company {
          id
          name
        }
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const data: any = await client.request(query, { id: personId });
    return {
      id: data.person.id,
      firstName: data.person.name?.firstName || '',
      lastName: data.person.name?.lastName || '',
      email: data.person.email || '',
      phone: data.person.phone || '',
      jobTitle: data.person.jobTitle || '',
      company: data.person.company,
      createdAt: data.person.createdAt,
      updatedAt: data.person.updatedAt,
    };
  } catch (error) {
    console.error(`[Twenty CRM] Error fetching person ${personId}:`, error);
    throw new Error('Failed to fetch contact from Twenty CRM');
  }
}

export async function createPerson(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
}): Promise<TwentyPerson> {
  const client = getTwentyClient();

  const mutation = `
    mutation CreatePerson($data: PersonCreateInput!) {
      createPerson(data: $data) {
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
        createdAt
        updatedAt
      }
    }
  `;

  try {
    // Transform input to match Twenty CRM schema
    const personData: any = {
      name: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      emails: {
        primaryEmail: input.email,
      },
    };

    if (input.phone && input.phone.startsWith('+')) {
      personData.phones = {
        primaryPhoneNumber: input.phone,
      };
    }

    if (input.jobTitle) {
      personData.city = input.jobTitle; // Using city field for jobTitle
    }

    if (input.companyId) {
      personData.companyId = input.companyId;
    }

    const data: any = await client.request(mutation, { data: personData });

    return {
      id: data.createPerson.id,
      firstName: data.createPerson.name?.firstName || '',
      lastName: data.createPerson.name?.lastName || '',
      email: data.createPerson.emails?.primaryEmail || '',
      phone: data.createPerson.phones?.primaryPhoneNumber || '',
      jobTitle: data.createPerson.city || '',
      createdAt: data.createPerson.createdAt,
      updatedAt: data.createPerson.updatedAt,
    };
  } catch (error: any) {
    console.error('[Twenty CRM] Error creating person:', JSON.stringify(error, null, 2));
    console.error('[Twenty CRM] Error details:', error);
    throw new Error(`Failed to create contact in Twenty CRM: ${error.message || 'Unknown error'}`);
  }
}

export async function deletePerson(personId: string): Promise<boolean> {
  const client = getTwentyClient();

  const mutation = `
    mutation DeletePerson($id: UUID!) {
      deletePerson(id: $id) {
        id
      }
    }
  `;

  try {
    await client.request(mutation, { id: personId });
    return true;
  } catch (error) {
    console.error('[Twenty CRM] Error deleting person:', error);
    throw new Error('Failed to delete contact from Twenty CRM');
  }
}

// ==================== COMPANIES ====================

export interface TwentyCompany {
  id: string;
  name: string;
  domainName: string;
  employees: number;
  annualRecurringRevenue: number;
  idealCustomerProfile: boolean;
  linkedinUrl?: string;
  xUrl?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export async function getCompanies(): Promise<TwentyCompany[]> {
  const client = getTwentyClient();

  const query = `
    query GetCompanies {
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
            xLink {
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
    }
  `;

  try {
    const data: any = await client.request(query);
    return data.companies.edges.map((edge: any) => ({
      id: edge.node.id,
      name: edge.node.name || 'Unnamed Company',
      domainName: edge.node.domainName?.primaryLinkUrl || '',
      employees: edge.node.employees || 0,
      annualRecurringRevenue: 0, // Not available in current schema
      idealCustomerProfile: edge.node.idealCustomerProfile || false,
      linkedinUrl: edge.node.linkedinLink?.primaryLinkUrl || '',
      xUrl: edge.node.xLink?.primaryLinkUrl || '',
      address: edge.node.address ? {
        street: edge.node.address.addressStreet1 || '',
        city: edge.node.address.addressCity || '',
        state: edge.node.address.addressState || '',
        country: edge.node.address.addressCountry || '',
      } : null,
      createdAt: edge.node.createdAt,
      updatedAt: edge.node.updatedAt,
    }));
  } catch (error) {
    console.error('[Twenty CRM] Error fetching companies:', error);
    throw new Error('Failed to fetch companies from Twenty CRM');
  }
}

export async function createCompany(input: {
  name: string;
  domainName?: string;
  employees?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}): Promise<TwentyCompany> {
  const client = getTwentyClient();

  const mutation = `
    mutation CreateCompany($input: CompanyCreateInput!) {
      createCompany(data: $input) {
        id
        name
        domainName {
          primaryLinkUrl
        }
        employees
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const companyInput: any = {
      name: input.name,
    };

    if (input.domainName) {
      companyInput.domainName = { primaryLinkUrl: input.domainName };
    }
    if (input.employees) {
      companyInput.employees = input.employees;
    }
    if (input.address) {
      companyInput.address = {
        addressStreet1: input.address.street || '',
        addressCity: input.address.city || '',
        addressState: input.address.state || '',
        addressCountry: input.address.country || '',
      };
    }

    const data: any = await client.request(mutation, { input: companyInput });
    return {
      id: data.createCompany.id,
      name: data.createCompany.name,
      domainName: data.createCompany.domainName?.primaryLinkUrl || '',
      employees: data.createCompany.employees || 0,
      annualRecurringRevenue: 0,
      idealCustomerProfile: false,
      createdAt: data.createCompany.createdAt,
      updatedAt: data.createCompany.updatedAt,
    };
  } catch (error) {
    console.error('[Twenty CRM] Error creating company:', error);
    throw new Error('Failed to create company in Twenty CRM');
  }
}

export async function deleteCompany(companyId: string): Promise<boolean> {
  const client = getTwentyClient();

  const mutation = `
    mutation DeleteCompany($id: UUID!) {
      deleteCompany(id: $id) {
        id
      }
    }
  `;

  try {
    await client.request(mutation, { id: companyId });
    return true;
  } catch (error) {
    console.error('[Twenty CRM] Error deleting company:', error);
    throw new Error('Failed to delete company from Twenty CRM');
  }
}

// ==================== OPPORTUNITIES (DEALS) ====================

export interface TwentyOpportunity {
  id: string;
  name: string;
  amount: number;
  stage: string;
  probability: number;
  closeDate: string;
  pointOfContact?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  company?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getOpportunities(): Promise<TwentyOpportunity[]> {
  const client = getTwentyClient();

  const query = `
    query GetOpportunities {
      opportunities {
        edges {
          node {
            id
            name
            amount
            stage
            probability
            closeDate
            pointOfContact {
              id
              firstName
              lastName
            }
            company {
              id
              name
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const data: any = await client.request(query);
    return data.opportunities.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('[Twenty CRM] Error fetching opportunities:', error);
    throw new Error('Failed to fetch deals from Twenty CRM');
  }
}

// ==================== TASKS ====================

export interface TwentyTask {
  id: string;
  title: string;
  body: string;
  status: string;
  dueAt: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function getTasks(): Promise<TwentyTask[]> {
  const client = getTwentyClient();

  const query = `
    query GetTasks {
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
              firstName
              lastName
            }
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  try {
    const data: any = await client.request(query);
    return data.tasks.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('[Twenty CRM] Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks from Twenty CRM');
  }
}

// ==================== HEALTH CHECK ====================

export async function checkTwentyHealth(): Promise<boolean> {
  try {
    const client = getTwentyClient();
    // Simple query to check if API is accessible
    await client.request(`{ __typename }`);
    return true;
  } catch (error) {
    console.error('[Twenty CRM] Health check failed:', error);
    return false;
  }
}

// ==================== CONFIGURATION ====================

export function isTwentyConfigured(): boolean {
  return !!(process.env.TWENTY_GRAPHQL_URL && process.env.TWENTY_API_KEY);
}
