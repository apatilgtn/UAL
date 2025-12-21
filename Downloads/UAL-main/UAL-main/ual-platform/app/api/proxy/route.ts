import { NextRequest, NextResponse } from 'next/server';

/**
 * API Proxy Route
 * Handles CORS and forwards HTTP requests to target APIs
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, method = 'GET', headers = {}, requestBody } = body;

        if (!url) {
            return NextResponse.json(
                { error: 'URL is required' },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: 'Invalid URL format' },
                { status: 400 }
            );
        }

        const startTime = Date.now();

        // Prepare fetch options
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
        };

        // Add body for non-GET requests
        if (method !== 'GET' && method !== 'HEAD' && requestBody) {
            fetchOptions.body = typeof requestBody === 'string' 
                ? requestBody 
                : JSON.stringify(requestBody);
        }

        // Make the request
        const response = await fetch(url, fetchOptions);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        // Get response headers
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });

        // Try to parse response as JSON, fallback to text
        let responseData: any;
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            try {
                responseData = await response.json();
            } catch {
                responseData = await response.text();
            }
        } else {
            responseData = await response.text();
        }

        return NextResponse.json({
            success: true,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            data: responseData,
            responseTime,
            timestamp: new Date().toISOString(),
        });
    } catch (error: any) {
        console.error('[API Proxy] Error:', error);
        
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to make request',
            errorType: error.name || 'Error',
            timestamp: new Date().toISOString(),
        }, { status: 500 });
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
