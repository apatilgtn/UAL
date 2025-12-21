import { NextRequest, NextResponse } from 'next/server';
import { checkTwentyHealth } from '@/lib/twenty-client';

/**
 * GET /api/crm/health
 * Check Twenty CRM connection health
 */
export async function GET(request: NextRequest) {
    try {
        const isHealthy = await checkTwentyHealth();

        if (isHealthy) {
            return NextResponse.json({
                success: true,
                status: 'healthy',
                message: 'Twenty CRM is connected and responding',
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    status: 'unhealthy',
                    message: 'Cannot connect to Twenty CRM',
                },
                { status: 503 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                status: 'error',
                message: error.message || 'Health check failed',
            },
            { status: 500 }
        );
    }
}
