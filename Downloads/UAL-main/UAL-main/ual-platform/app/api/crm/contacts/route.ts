import { NextRequest, NextResponse } from 'next/server';
import { getPeople, createPerson } from '@/lib/twenty-client';

/**
 * GET /api/crm/contacts
 * Fetch all contacts from Twenty CRM
 */
export async function GET(request: NextRequest) {
    try {
        // Fetch people from Twenty CRM
        const people = await getPeople();

        // Transform to our format
        const contacts = people.map(person => ({
            id: person.id,
            firstName: person.firstName,
            lastName: person.lastName,
            email: person.email,
            phone: person.phone,
            company: person.company?.name || '',
            jobTitle: person.jobTitle,
            status: 'active',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.firstName}`,
            createdAt: new Date(person.createdAt),
        }));

        return NextResponse.json({
            success: true,
            data: { contacts },
        });

    } catch (error: any) {
        console.error('[API /api/crm/contacts] Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch contacts',
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/crm/contacts
 * Create a new contact in Twenty CRM
 */
export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();

        // Validate required fields
        if (!body.firstName || !body.lastName || !body.email) {
            return NextResponse.json(
                { error: 'Missing required fields: firstName, lastName, and email' },
                { status: 400 }
            );
        }

        // Create person in Twenty CRM
        const person = await createPerson({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            jobTitle: body.jobTitle,
            companyId: body.companyId,
        });

        return NextResponse.json(
            {
                success: true,
                data: { contact: person },
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('[API /api/crm/contacts] Error creating contact:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create contact',
            },
            { status: 500 }
        );
    }
}
