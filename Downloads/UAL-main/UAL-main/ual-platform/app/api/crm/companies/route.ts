import { NextRequest, NextResponse } from 'next/server';
import { getCompanies, createCompany } from '@/lib/twenty-client';

/**
 * GET /api/crm/companies
 * Fetch all companies from Twenty CRM
 */
export async function GET(request: NextRequest) {
    try {
        // Fetch companies from Twenty CRM
        const companies = await getCompanies();

        // Transform to our format
        const formattedCompanies = companies.map(company => ({
            id: company.id,
            name: company.name,
            industry: 'Technology', // Can be enhanced with custom fields
            size: company.employees ? `${company.employees}+ employees` : 'Unknown',
            revenue: company.annualRecurringRevenue || 0,
            website: company.domainName ? `https://${company.domainName}` : '',
            address: company.address
                ? `${company.address.city}, ${company.address.state}, ${company.address.country}`.replace(/^, |, $/g, '')
                : '',
            linkedinUrl: company.linkedinUrl || '',
            xUrl: company.xUrl || '',
            createdAt: new Date(company.createdAt),
        }));

        return NextResponse.json({
            success: true,
            data: { companies: formattedCompanies },
        });

    } catch (error: any) {
        console.error('[API /api/crm/companies] Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch companies',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/crm/companies
 * Create a new company in Twenty CRM
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { error: 'Missing required field: name' },
                { status: 400 }
            );
        }

        // Create company in Twenty CRM
        const company = await createCompany({
            name: body.name,
            domainName: body.domainName,
            employees: body.employees,
            address: body.address,
        });

        return NextResponse.json(
            {
                success: true,
                data: { company },
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('[API /api/crm/companies] Error creating company:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create company',
            },
            { status: 500 }
        );
    }
}
