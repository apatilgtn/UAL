import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/webhooks/twenty
 * Webhook receiver for Twenty CRM events
 * 
 * Set this URL in Twenty CRM:
 * Settings → APIs & Webhooks → Create Webhook
 * URL: https://your-domain.com/api/webhooks/twenty
 */
export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        console.log('[Twenty Webhook] Received event:', {
            event: payload.event,
            timestamp: payload.timestamp,
            dataId: payload.data?.id,
        });

        // Handle different event types
        switch (payload.event) {
            case 'person.created':
                console.log('[Twenty Webhook] New contact created:', payload.data);
                // TODO: Trigger real-time UI update
                break;

            case 'person.updated':
                console.log('[Twenty Webhook] Contact updated:', payload.data);
                // TODO: Invalidate cache, trigger UI update
                break;

            case 'person.deleted':
                console.log('[Twenty Webhook] Contact deleted:', payload.data);
                // TODO: Remove from cache, trigger UI update
                break;

            case 'company.created':
            case 'company.updated':
            case 'company.deleted':
                console.log('[Twenty Webhook] Company event:', payload.event);
                break;

            case 'opportunity.created':
            case 'opportunity.updated':
            case 'opportunity.deleted':
                console.log('[Twenty Webhook] Opportunity event:', payload.event);
                break;

            case 'task.created':
            case 'task.updated':
            case 'task.deleted':
                console.log('[Twenty Webhook] Task event:', payload.event);
                break;

            default:
                console.log('[Twenty Webhook] Unknown event type:', payload.event);
        }

        // Respond quickly to Twenty CRM
        return NextResponse.json({
            success: true,
            received: true,
            event: payload.event,
        });

    } catch (error: any) {
        console.error('[Twenty Webhook] Error processing webhook:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process webhook',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/webhooks/twenty
 * Health check endpoint (for testing webhook is accessible)
 */
export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'healthy',
        message: 'Twenty CRM webhook endpoint is ready',
        url: request.url,
    });
}
