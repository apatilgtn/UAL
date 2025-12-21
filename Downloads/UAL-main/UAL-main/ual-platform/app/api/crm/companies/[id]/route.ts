import { NextRequest, NextResponse } from 'next/server';
import { deleteCompany } from '@/lib/twenty-client';

/**
 * DELETE /api/crm/companies/[id]
 * Delete a company from Twenty CRM
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params in Next.js 15
        const { id: companyId } = await params;

        console.log('[API] Deleting company with ID:', companyId);

        // Delete from Twenty CRM
        await deleteCompany(companyId);

        console.log('[API] Company deleted successfully');

        return NextResponse.json(
            {
                success: true,
                message: 'Company deleted successfully',
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('[API /api/crm/companies/[id]] Error deleting company:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete company',
            },
            { status: 500 }
        );
    }
}
