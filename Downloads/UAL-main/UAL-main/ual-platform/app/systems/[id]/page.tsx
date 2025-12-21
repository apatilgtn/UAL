'use client';

import { useParams, useRouter } from 'next/navigation';
import { getSystemById } from '../../../lib/mock-data';
import { useState } from 'react';

export default function SystemDetail() {
    const params = useParams();
    const router = useRouter();
    const systemId = params.id as string;

    const system = getSystemById(systemId);
    const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'endpoints' | 'docs'>('overview');

    if (!system) {
        return (
            <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h2>System not found</h2>
                <p>The system you're looking for doesn't exist.</p>
                <button className="btn btn-primary" onClick={() => router.push('/')}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const { metadata, health, dataCatalog, endpoints, accessControl } = system;

    const healthClass = health.status === 'healthy' ? 'healthy' :
        health.status === 'degraded' ? 'degraded' : 'unhealthy';

    const healthBadgeClass = health.status === 'healthy' ? 'badge-success' :
        health.status === 'degraded' ? 'badge-warning' : 'badge-danger';

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Back button */}
            <button
                className="btn btn-ghost"
                onClick={() => router.push('/')}
                style={{ marginBottom: '1rem' }}
            >
                ← Back to Dashboard
            </button>

            {/* System Header */}
            <div className="glass-card mb-lg">
                <div className="flex justify-between items-center mb-md">
                    <div>
                        <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>{metadata.displayName}</h1>
                        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                            {metadata.description}
                        </p>
                    </div>
                    <span className={`badge ${healthBadgeClass}`} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        <span className={`status-dot ${healthClass}`}></span>
                        {health.status.toUpperCase()}
                    </span>
                </div>

                <div className="flex gap-md" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    {metadata.tags.map((tag, index) => (
                        <span key={`${tag}-${index}`} className="badge badge-secondary">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="grid grid-4" style={{ marginTop: '1.5rem', gap: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                            SYSTEM ID
                        </div>
                        <code className="code-inline">{metadata.systemId}</code>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                            VERSION
                        </div>
                        <strong>{metadata.version.current}</strong>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                            ENVIRONMENT
                        </div>
                        <span className="badge badge-primary">{metadata.environment}</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                            YOUR ACCESS
                        </div>
                        <strong style={{ textTransform: 'uppercase' }}>{accessControl.currentUserAccess}</strong>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`tab ${activeTab === 'datasets' ? 'active' : ''}`}
                    onClick={() => setActiveTab('datasets')}
                >
                    Datasets ({dataCatalog.datasets.length})
                </button>
                <button
                    className={`tab ${activeTab === 'endpoints' ? 'active' : ''}`}
                    onClick={() => setActiveTab('endpoints')}
                >
                    Endpoints ({endpoints.length})
                </button>
                <button
                    className={`tab ${activeTab === 'docs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('docs')}
                >
                    Documentation
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div>
                    {/* System Health */}
                    <div className="glass-card mb-lg">
                        <h3 className="mb-md">System Health</h3>
                        <div className="grid grid-4">
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    STATUS
                                </div>
                                <span className={`badge ${healthBadgeClass}`}>
                                    <span className={`status-dot ${healthClass}`}></span>
                                    {health.status}
                                </span>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    UPTIME
                                </div>
                                <strong>{Math.floor(health.uptime / 3600)} hours</strong>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    RESPONSE TIME
                                </div>
                                <strong>{health.responseTime}ms</strong>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    ERROR RATE
                                </div>
                                <strong>{health.errorRate.toFixed(2)}%</strong>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="glass-card mb-lg">
                        <h3 className="mb-md">System Owner & Support</h3>
                        <div className="grid grid-3">
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    TEAM
                                </div>
                                <strong>{metadata.owner.team}</strong>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    EMAIL
                                </div>
                                <a href={`mailto:${metadata.owner.email}`}>{metadata.owner.email}</a>
                            </div>
                            {metadata.owner.slack && (
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                        SLACK
                                    </div>
                                    <code className="code-inline">{metadata.owner.slack}</code>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Access Control */}
                    <div className="glass-card">
                        <h3 className="mb-md">Access Control</h3>
                        <div className="mb-md">
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                YOUR ACCESS LEVEL
                            </div>
                            <span className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                {accessControl.currentUserAccess.toUpperCase()}
                            </span>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Access Policies
                            </div>
                            {accessControl.accessPolicies.map((policy, index) => (
                                <div key={index} style={{ marginBottom: '1rem', paddingLeft: '1rem', borderLeft: '2px solid var(--color-primary)' }}>
                                    <strong>{policy.name}</strong>
                                    <p style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>{policy.description}</p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                                        Granted by: {policy.grantedBy}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {accessControl.requestAccessUrl && (
                            <a href={accessControl.requestAccessUrl} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Request Additional Access
                            </a>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'datasets' && (
                <div className="grid grid-2">
                    {dataCatalog.datasets.map((dataset) => (
                        <div key={dataset.id} className="glass-card">
                            <div className="flex justify-between items-center mb-md">
                                <h4 style={{ margin: 0 }}>{dataset.name}</h4>
                                <span className="badge badge-success">
                                    Quality: {dataset.quality.score}%
                                </span>
                            </div>

                            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {dataset.description}
                            </p>

                            <div className="grid grid-2" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                                <div>
                                    <strong>{dataset.recordCount?.toLocaleString() || 'N/A'}</strong> records
                                </div>
                                <div>
                                    <strong>{dataset.schema.fields.length}</strong> fields
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                                    SCHEMA FIELDS
                                </div>
                                <div style={{ fontSize: '0.75rem' }}>
                                    {dataset.schema.fields.slice(0, 5).map(field => (
                                        <div key={field.name} style={{ marginBottom: '0.25rem' }}>
                                            <code className="code-inline">{field.name}</code>
                                            <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.5rem' }}>
                                                {field.type}
                                            </span>
                                        </div>
                                    ))}
                                    {dataset.schema.fields.length > 5 && (
                                        <div style={{ color: 'var(--color-text-tertiary)' }}>
                                            +{dataset.schema.fields.length - 5} more fields
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                {dataset.tags.map(tag => (
                                    <span key={tag} className="badge badge-secondary" style={{ fontSize: '0.625rem' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'endpoints' && (
                <div>
                    {endpoints.map((endpoint, index) => (
                        <div key={index} className="glass-card mb-md">
                            <div className="flex gap-sm items-center mb-md">
                                <span className={`badge ${endpoint.method === 'GET' ? 'badge-success' :
                                    endpoint.method === 'POST' ? 'badge-primary' :
                                        endpoint.method === 'DELETE' ? 'badge-danger' : 'badge-secondary'
                                    }`}>
                                    {endpoint.method}
                                </span>
                                <code className="code-inline" style={{ fontSize: '1rem' }}>{endpoint.path}</code>
                            </div>

                            <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {endpoint.description}
                            </p>

                            {endpoint.parameters && endpoint.parameters.length > 0 && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        Parameters
                                    </div>
                                    {endpoint.parameters.map(param => (
                                        <div key={param.name} style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                                            <code className="code-inline">{param.name}</code>
                                            <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.5rem' }}>
                                                {param.type} {param.required && '(required)'}
                                            </span>
                                            <div style={{ marginLeft: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                                {param.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {endpoint.rateLimit && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                                    Rate limit: {endpoint.rateLimit.requests} requests per {endpoint.rateLimit.period}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'docs' && (
                <div>
                    <div className="glass-card mb-lg">
                        <h3 className="mb-md">Overview</h3>
                        <p>{metadata.documentation.overview}</p>
                    </div>

                    {metadata.documentation.gettingStarted && (
                        <div className="glass-card mb-lg">
                            <h3 className="mb-md">Getting Started</h3>
                            <p>{metadata.documentation.gettingStarted}</p>
                        </div>
                    )}

                    {metadata.documentation.examples && metadata.documentation.examples.length > 0 && (
                        <div className="glass-card mb-lg">
                            <h3 className="mb-md">Code Examples</h3>
                            {metadata.documentation.examples.map((example, index) => (
                                <div key={index} style={{ marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{example.title}</h4>
                                    <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{example.description}</p>
                                    <div className="code-block">
                                        <code>{example.code}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {metadata.documentation.faq && metadata.documentation.faq.length > 0 && (
                        <div className="glass-card">
                            <h3 className="mb-md">Frequently Asked Questions</h3>
                            {metadata.documentation.faq.map((faq, index) => (
                                <div key={index} style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.975rem', marginBottom: '0.5rem' }}>❓ {faq.question}</h4>
                                    <p style={{ fontSize: '0.875rem', marginLeft: '1.5rem' }}>{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
