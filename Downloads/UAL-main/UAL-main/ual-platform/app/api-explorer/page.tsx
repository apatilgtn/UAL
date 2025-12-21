'use client';

import { useState, useEffect } from 'react';
import { systems } from '@/lib/mock-data';

interface RequestHistory {
    id: string;
    url: string;
    method: string;
    timestamp: string;
    status?: number;
    responseTime?: number;
}

interface ApiResponse {
    success: boolean;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    data?: any;
    responseTime?: number;
    error?: string;
    errorType?: string;
    timestamp?: string;
}

interface TwentyEndpoint {
    id: string;
    name: string;
    method: string;
    path: string;
    operation: string;
    operationName: string;
    description: string;
    category: string;
    query: string;
    variables: any;
    sampleResponse: any;
}

export default function APIExplorerPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSystem, setSelectedSystem] = useState('all');
    const [selectedMethod, setSelectedMethod] = useState('all');
    const [activeSection, setActiveSection] = useState<'all' | 'twenty' | 'mock'>('all');

    // Request builder state
    const [showRequestBuilder, setShowRequestBuilder] = useState(false);
    const [requestUrl, setRequestUrl] = useState('');
    const [requestMethod, setRequestMethod] = useState('GET');
    const [requestHeaders, setRequestHeaders] = useState<{ key: string, value: string }[]>([
        { key: 'Content-Type', value: 'application/json' }
    ]);
    const [requestBody, setRequestBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');
    const [isGraphQL, setIsGraphQL] = useState(false);

    // Twenty CRM endpoints
    const [twentyEndpoints, setTwentyEndpoints] = useState<TwentyEndpoint[]>([]);
    const [twentyConfigured, setTwentyConfigured] = useState(false);
    const [loadingTwenty, setLoadingTwenty] = useState(true);

    // Request history
    const [history, setHistory] = useState<RequestHistory[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    // Fetch Twenty CRM endpoints
    useEffect(() => {
        const fetchTwentyEndpoints = async () => {
            try {
                const res = await fetch('/api/twenty');
                const data = await res.json();
                if (data.success) {
                    setTwentyEndpoints(data.endpoints);
                    setTwentyConfigured(data.configured);
                }
            } catch (error) {
                console.error('Failed to fetch Twenty endpoints:', error);
            } finally {
                setLoadingTwenty(false);
            }
        };
        fetchTwentyEndpoints();
    }, []);

    // Load history from localStorage
    useEffect(() => {
        const savedHistory = localStorage.getItem('api-explorer-history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Failed to load history:', e);
            }
        }
    }, []);

    // Save history to localStorage
    const saveToHistory = (entry: RequestHistory) => {
        const newHistory = [entry, ...history.slice(0, 49)]; // Keep last 50
        setHistory(newHistory);
        localStorage.setItem('api-explorer-history', JSON.stringify(newHistory));
    };

    // Get all endpoints from all systems
    const allEndpoints = systems.flatMap(system =>
        system.endpoints.map(endpoint => ({
            ...endpoint,
            systemId: system.metadata.systemId,
            systemName: system.metadata.displayName,
            systemType: system.metadata.type,
        }))
    );

    // Filter endpoints
    const filteredEndpoints = allEndpoints.filter(endpoint => {
        const matchesSearch = !searchQuery ||
            endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            endpoint.systemName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSystem = selectedSystem === 'all' || endpoint.systemId === selectedSystem;
        const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;

        return matchesSearch && matchesSystem && matchesMethod;
    });

    const methodColors: Record<string, string> = {
        'GET': '#10b981',
        'POST': '#3b82f6',
        'PUT': '#f59e0b',
        'DELETE': '#ef4444',
        'PATCH': '#8b5cf6',
    };

    const statusColors: Record<string, string> = {
        '2': '#10b981', // 2xx - Success
        '3': '#3b82f6', // 3xx - Redirect
        '4': '#f59e0b', // 4xx - Client Error
        '5': '#ef4444', // 5xx - Server Error
    };

    const getStatusColor = (status: number) => {
        const firstDigit = String(status)[0];
        return statusColors[firstDigit] || '#6b7280';
    };

    const handleTryIt = (endpoint: any) => {
        // Pre-fill the request builder with endpoint data
        const baseUrl = endpoint.systemType === 'crm'
            ? 'https://api.twenty.com'
            : 'https://jsonplaceholder.typicode.com';

        // Map endpoint path to a working test URL
        let testUrl = baseUrl;
        if (endpoint.path.includes('users')) {
            testUrl = 'https://jsonplaceholder.typicode.com/users';
        } else if (endpoint.path.includes('posts')) {
            testUrl = 'https://jsonplaceholder.typicode.com/posts';
        } else if (endpoint.path.includes('orders')) {
            testUrl = 'https://jsonplaceholder.typicode.com/posts'; // Use posts as mock
        } else {
            testUrl = 'https://jsonplaceholder.typicode.com/todos/1';
        }

        setRequestUrl(testUrl);
        setRequestMethod(endpoint.method);
        setRequestHeaders([{ key: 'Content-Type', value: 'application/json' }]);

        if (endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
            const sampleBody = endpoint.requestBody || { title: 'Test', body: 'Test content', userId: 1 };
            setRequestBody(JSON.stringify(sampleBody, null, 2));
        } else {
            setRequestBody('');
        }

        setResponse(null);
        setShowRequestBuilder(true);
        setIsGraphQL(false);
    };

    const handleTryTwenty = (endpoint: TwentyEndpoint) => {
        // Pre-fill for Twenty CRM GraphQL request
        setRequestUrl('Twenty CRM GraphQL');
        setRequestMethod('POST');
        setRequestHeaders([
            { key: 'Content-Type', value: 'application/json' }
        ]);

        const graphqlBody = {
            query: endpoint.query,
            variables: endpoint.variables,
            operationName: endpoint.operationName
        };
        setRequestBody(JSON.stringify(graphqlBody, null, 2));
        setResponse(null);
        setShowRequestBuilder(true);
        setIsGraphQL(true);
    };

    const handleSendRequest = async () => {
        if (!requestUrl) return;

        setIsLoading(true);
        setResponse(null);

        try {
            // Build headers object
            const headers: Record<string, string> = {};
            requestHeaders.forEach(h => {
                if (h.key && h.value) {
                    headers[h.key] = h.value;
                }
            });

            // Parse request body
            let parsedBody = null;
            if (requestBody && requestMethod !== 'GET' && requestMethod !== 'HEAD') {
                try {
                    parsedBody = JSON.parse(requestBody);
                } catch {
                    parsedBody = requestBody;
                }
            }

            let data: ApiResponse;

            // Check if this is a Twenty CRM GraphQL request
            if (isGraphQL && requestUrl === 'Twenty CRM GraphQL') {
                const res = await fetch('/api/twenty', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(parsedBody),
                });
                data = await res.json();
            } else {
                // Regular REST request via proxy
                const res = await fetch('/api/proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: requestUrl,
                        method: requestMethod,
                        headers,
                        requestBody: parsedBody,
                    }),
                });
                data = await res.json();
            }

            setResponse(data);

            // Save to history
            saveToHistory({
                id: Date.now().toString(),
                url: requestUrl,
                method: requestMethod,
                timestamp: new Date().toISOString(),
                status: data.status,
                responseTime: data.responseTime,
            });
        } catch (error: any) {
            setResponse({
                success: false,
                error: error.message || 'Failed to send request',
                errorType: 'NetworkError',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleHistoryClick = (entry: RequestHistory) => {
        setRequestUrl(entry.url);
        setRequestMethod(entry.method);
        setShowHistory(false);
        setShowRequestBuilder(true);
    };

    const addHeader = () => {
        setRequestHeaders([...requestHeaders, { key: '', value: '' }]);
    };

    const removeHeader = (index: number) => {
        setRequestHeaders(requestHeaders.filter((_, i) => i !== index));
    };

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...requestHeaders];
        newHeaders[index][field] = value;
        setRequestHeaders(newHeaders);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('api-explorer-history');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 style={{ marginBottom: '1rem' }}>API Explorer</h1>
                        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                            Discover, explore, and test API endpoints in real-time
                        </p>
                    </div>
                    <div className="flex gap-sm">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowHistory(!showHistory)}
                            style={{ position: 'relative' }}
                        >
                            📜 History
                            {history.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {history.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setRequestUrl('');
                                setRequestMethod('GET');
                                setRequestBody('');
                                setResponse(null);
                                setShowRequestBuilder(true);
                            }}
                        >
                            ➕ New Request
                        </button>
                    </div>
                </div>
            </div>

            {/* Request History Panel */}
            {showHistory && (
                <div className="glass-card mb-lg" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    <div className="flex justify-between items-center mb-md">
                        <h3 style={{ margin: 0 }}>Request History</h3>
                        {history.length > 0 && (
                            <button
                                className="btn btn-secondary"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                onClick={clearHistory}
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '2rem' }}>
                            No request history yet. Try making some requests!
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {history.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => handleHistoryClick(entry)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <span
                                        style={{
                                            background: `${methodColors[entry.method]}20`,
                                            color: methodColors[entry.method],
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            minWidth: '60px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {entry.method}
                                    </span>
                                    <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {entry.url}
                                    </span>
                                    {entry.status && (
                                        <span style={{
                                            color: getStatusColor(entry.status),
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                        }}>
                                            {entry.status}
                                        </span>
                                    )}
                                    {entry.responseTime && (
                                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                                            {entry.responseTime}ms
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Request Builder Modal */}
            {showRequestBuilder && (
                <div className="glass-card mb-lg" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <div className="flex justify-between items-center mb-md">
                        <h3 style={{ margin: 0 }}>🚀 Request Builder</h3>
                        <button
                            onClick={() => setShowRequestBuilder(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* URL and Method */}
                    <div className="flex gap-md mb-md">
                        <select
                            className="input"
                            value={requestMethod}
                            onChange={(e) => setRequestMethod(e.target.value)}
                            style={{
                                width: '120px',
                                background: `${methodColors[requestMethod]}20`,
                                color: methodColors[requestMethod],
                                fontWeight: '600',
                            }}
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter request URL (e.g., https://api.example.com/users)"
                            value={requestUrl}
                            onChange={(e) => setRequestUrl(e.target.value)}
                            style={{ flex: 1, fontFamily: 'monospace' }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSendRequest}
                            disabled={isLoading || !requestUrl}
                            style={{ minWidth: '100px' }}
                        >
                            {isLoading ? '⏳ Sending...' : '▶ Send'}
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-sm mb-md">
                        <button
                            className={`btn ${activeTab === 'headers' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('headers')}
                            style={{ fontSize: '0.875rem' }}
                        >
                            Headers ({requestHeaders.length})
                        </button>
                        <button
                            className={`btn ${activeTab === 'body' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab('body')}
                            style={{ fontSize: '0.875rem' }}
                        >
                            Body
                        </button>
                    </div>

                    {/* Headers Tab */}
                    {activeTab === 'headers' && (
                        <div style={{ marginBottom: '1rem' }}>
                            {requestHeaders.map((header, index) => (
                                <div key={index} className="flex gap-sm mb-sm">
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Header name"
                                        value={header.key}
                                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Header value"
                                        value={header.value}
                                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                        style={{ flex: 2 }}
                                    />
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => removeHeader(index)}
                                        style={{ padding: '0.5rem' }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                            <button className="btn btn-secondary" onClick={addHeader} style={{ fontSize: '0.875rem' }}>
                                + Add Header
                            </button>
                        </div>
                    )}

                    {/* Body Tab */}
                    {activeTab === 'body' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <textarea
                                className="input"
                                placeholder='{"key": "value"}'
                                value={requestBody}
                                onChange={(e) => setRequestBody(e.target.value)}
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    fontFamily: 'monospace',
                                    fontSize: '0.875rem',
                                    resize: 'vertical',
                                }}
                            />
                        </div>
                    )}

                    {/* Response Section */}
                    {response && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                        }}>
                            <div className="flex justify-between items-center mb-md">
                                <h4 style={{ margin: 0 }}>Response</h4>
                                <div className="flex gap-md items-center">
                                    {response.responseTime && (
                                        <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem' }}>
                                            ⏱️ {response.responseTime}ms
                                        </span>
                                    )}
                                    {response.status && (
                                        <span style={{
                                            background: `${getStatusColor(response.status)}20`,
                                            color: getStatusColor(response.status),
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '4px',
                                            fontWeight: '600',
                                        }}>
                                            {response.status} {response.statusText}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {response.error ? (
                                <div style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid #ef4444',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    color: '#ef4444',
                                }}>
                                    <strong>{response.errorType}:</strong> {response.error}
                                </div>
                            ) : (
                                <>
                                    {/* Response Headers */}
                                    {response.headers && (
                                        <details style={{ marginBottom: '1rem' }}>
                                            <summary style={{ cursor: 'pointer', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                                Response Headers ({Object.keys(response.headers).length})
                                            </summary>
                                            <div style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '0.75rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontFamily: 'monospace',
                                            }}>
                                                {Object.entries(response.headers).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span style={{ color: '#93c5fd' }}>{key}:</span> {value}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    )}

                                    {/* Response Body */}
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => navigator.clipboard.writeText(JSON.stringify(response.data, null, 2))}
                                            style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: 'none',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-secondary)',
                                            }}
                                        >
                                            📋 Copy
                                        </button>
                                        <pre style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            padding: '1rem',
                                            borderRadius: '4px',
                                            overflow: 'auto',
                                            maxHeight: '400px',
                                            fontSize: '0.75rem',
                                            fontFamily: 'monospace',
                                        }}>
                                            {typeof response.data === 'string'
                                                ? response.data
                                                : JSON.stringify(response.data, null, 2)
                                            }
                                        </pre>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{allEndpoints.length + twentyEndpoints.length}</div>
                    <div className="stat-label">Total Endpoints</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">{systems.length + (twentyConfigured ? 1 : 0)}</div>
                    <div className="stat-label">Systems</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">{twentyEndpoints.length}</div>
                    <div className="stat-label">Twenty CRM APIs</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">{allEndpoints.filter(e => e.method === 'POST').length}</div>
                    <div className="stat-label">POST Endpoints</div>
                </div>
            </div>

            {/* Twenty CRM Section */}
            {twentyEndpoints.length > 0 && (
                <div className="section mb-lg">
                    <div className="flex justify-between items-center mb-md">
                        <div className="flex items-center gap-md">
                            <h2 style={{ margin: 0 }}>🔷 Twenty CRM APIs</h2>
                            {twentyConfigured ? (
                                <span className="badge" style={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b981' }}>
                                    ✓ Connected
                                </span>
                            ) : (
                                <span className="badge" style={{ background: '#f5970520', color: '#f59705', border: '1px solid #f59705' }}>
                                    ⚠ Not Configured
                                </span>
                            )}
                        </div>
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                            {twentyEndpoints.length} GraphQL endpoints
                        </span>
                    </div>

                    {/* Category tabs for Twenty CRM */}
                    <div className="flex gap-sm mb-md" style={{ flexWrap: 'wrap' }}>
                        {['People', 'Companies', 'Opportunities', 'Tasks', 'Notes', 'System'].map(category => {
                            const count = twentyEndpoints.filter(e => e.category === category).length;
                            if (count === 0) return null;
                            return (
                                <span
                                    key={category}
                                    className="badge badge-secondary"
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {category} ({count})
                                </span>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {twentyEndpoints.map((endpoint) => (
                            <div key={endpoint.id} className="glass-card">
                                <div className="flex items-start gap-md mb-md">
                                    <span
                                        className="badge"
                                        style={{
                                            background: endpoint.operation === 'query' ? '#10b98120' : '#3b82f620',
                                            color: endpoint.operation === 'query' ? '#10b981' : '#3b82f6',
                                            border: `1px solid ${endpoint.operation === 'query' ? '#10b981' : '#3b82f6'}`,
                                            fontWeight: '600',
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.75rem',
                                        }}
                                    >
                                        {endpoint.operation.toUpperCase()}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>
                                            {endpoint.name}
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            {endpoint.description}
                                        </p>
                                    </div>
                                    <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                                        {endpoint.category}
                                    </span>
                                </div>

                                {/* GraphQL Query Preview */}
                                <details style={{ marginBottom: '1rem' }}>
                                    <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                        📝 View GraphQL Query
                                    </summary>
                                    <pre style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '1rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        overflow: 'auto',
                                        maxHeight: '200px',
                                    }}>
                                        {endpoint.query}
                                    </pre>
                                </details>

                                {/* Variables Preview */}
                                {Object.keys(endpoint.variables).length > 0 && (
                                    <details style={{ marginBottom: '1rem' }}>
                                        <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                            🔧 Variables
                                        </summary>
                                        <pre style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            overflow: 'auto',
                                        }}>
                                            {JSON.stringify(endpoint.variables, null, 2)}
                                        </pre>
                                    </details>
                                )}

                                <div className="flex gap-sm">
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.875rem' }}
                                        onClick={() => handleTryTwenty(endpoint)}
                                        disabled={!twentyConfigured}
                                    >
                                        🚀 Try it out
                                    </button>
                                    <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                                        📖 View Sample Response
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="glass-card mb-lg">
                <div className="search-bar mb-md">
                    <svg
                        className="search-icon"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search endpoints by path, description, or system..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-md">
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            SYSTEM
                        </label>
                        <select
                            className="input"
                            value={selectedSystem}
                            onChange={(e) => setSelectedSystem(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Systems</option>
                            {systems.map(system => (
                                <option key={system.metadata.systemId} value={system.metadata.systemId}>
                                    {system.metadata.displayName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            METHOD
                        </label>
                        <select
                            className="input"
                            value={selectedMethod}
                            onChange={(e) => setSelectedMethod(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Methods</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>API Endpoints</h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredEndpoints.length} endpoint{filteredEndpoints.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredEndpoints.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {filteredEndpoints.map((endpoint, index) => (
                            <div key={index} className="glass-card">
                                <div className="flex items-start gap-md mb-md">
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${methodColors[endpoint.method]}20`,
                                            color: methodColors[endpoint.method],
                                            border: `1px solid ${methodColors[endpoint.method]}`,
                                            fontWeight: '600',
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.75rem',
                                        }}
                                    >
                                        {endpoint.method}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.5rem', fontFamily: 'monospace', fontSize: '1rem' }}>
                                            {endpoint.path}
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            {endpoint.description}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        SYSTEM
                                    </div>
                                    <div className="flex items-center gap-sm">
                                        <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                                            {endpoint.systemType}
                                        </span>
                                        <span style={{ fontSize: '0.875rem' }}>{endpoint.systemName}</span>
                                    </div>
                                </div>

                                {endpoint.parameters && endpoint.parameters.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                            PARAMETERS
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {endpoint.parameters.map((param: any, i: number) => (
                                                <span
                                                    key={i}
                                                    className="badge"
                                                    style={{
                                                        background: param.required ? '#fef2f2' : '#f0fdf4',
                                                        color: param.required ? '#dc2626' : '#16a34a',
                                                        border: `1px solid ${param.required ? '#dc2626' : '#16a34a'}`,
                                                        fontSize: '0.75rem',
                                                    }}
                                                >
                                                    {param.name}: {param.type}
                                                    {param.required && ' *'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {endpoint.authentication && endpoint.authentication.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                            AUTHENTICATION
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {endpoint.authentication.map((auth: string, i: number) => (
                                                <span key={i} className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                                                    🔐 {auth}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {endpoint.rateLimit && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                            RATE LIMIT
                                        </div>
                                        <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                                            ⚡ {endpoint.rateLimit.requests} requests per {endpoint.rateLimit.period}
                                        </span>
                                    </div>
                                )}

                                {endpoint.examples && endpoint.examples.length > 0 && (
                                    <details style={{ marginTop: '1rem' }}>
                                        <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                            📖 View Examples ({endpoint.examples.length})
                                        </summary>
                                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {endpoint.examples.map((example: any, i: number) => (
                                                <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                        {example.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                                                        {example.description}
                                                    </div>
                                                    {example.request && (
                                                        <div style={{ marginBottom: '0.5rem' }}>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                                                Request:
                                                            </div>
                                                            <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', overflow: 'auto' }}>
                                                                {JSON.stringify(example.request, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                                            Response:
                                                        </div>
                                                        <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', overflow: 'auto' }}>
                                                            {JSON.stringify(example.response, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                )}

                                <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.875rem' }}
                                        onClick={() => handleTryIt(endpoint)}
                                    >
                                        🚀 Try it out
                                    </button>
                                    <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
                                        View System
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3>No endpoints found</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
