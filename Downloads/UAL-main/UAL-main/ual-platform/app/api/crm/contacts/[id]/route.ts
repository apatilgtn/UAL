import { NextRequest, NextResponse } from 'next/server';
import { deletePerson } from '@/lib/twenty-client';

/**
 * DELETE /api/crm/contacts/[id]
 * Delete a contact from Twenty CRM
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params in Next.js 15
        const { id: contactId } = await params;

        console.log('[API] Deleting contact with ID:', contactId);

        // Delete from Twenty CRM
        await deletePerson(contactId);

        console.log('[API] Contact deleted successfully');

        return NextResponse.json(
            {
                success: true,
                message: 'Contact deleted successfully',
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('[API /api/crm/contacts/[id]] Error deleting contact:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete contact',
            },
            { status: 500 }
        );
    }
}
