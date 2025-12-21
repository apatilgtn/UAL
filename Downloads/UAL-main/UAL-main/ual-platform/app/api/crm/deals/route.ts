import { NextRequest, NextResponse } from 'next/server';
import { getOpportunities } from '@/lib/twenty-client';

/**
 * GET /api/crm/deals
 * Fetch all opportunities (deals) from Twenty CRM
 */
export async function GET(request: NextRequest) {
    try {
        // Fetch opportunities from Twenty CRM
        const opportunities = await getOpportunities();

        // Transform to our format
        const deals = opportunities.map(opp => ({
            id: opp.id,
            title: opp.name,
            value: opp.amount || 0,
            stage: opp.stage || 'lead',
            probability: opp.probability || 0,
            expectedCloseDate: opp.closeDate ? new Date(opp.closeDate) : new Date(),
            contactId: opp.pointOfContact?.id || '',
            contactName: opp.pointOfContact
                ? `${opp.pointOfContact.firstName} ${opp.pointOfContact.lastName}`
                : '',
            companyName: opp.company?.name || '',
            owner: 'You',
            createdAt: new Date(opp.createdAt),
        }));

        return NextResponse.json({
            success: true,
            data: { deals },
        });

    } catch (error: any) {
        console.error('[API /api/crm/deals] Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch deals',
            },
            { status: 500 }
        );
    }
}
