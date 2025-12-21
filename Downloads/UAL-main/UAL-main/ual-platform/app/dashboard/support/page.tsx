'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function SupportDashboard() {
    const { data: session } = useSession();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '0.5rem' }}>Support Dashboard</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Welcome, {session?.user?.name}! Monitor system health and access support resources.
                </p>
            </div>

            {/* System Health Overview */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">7</div>
                    <div className="stat-label">Healthy Systems</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fb923c 100%)' }}>
                    <div className="stat-value">1</div>
                    <div className="stat-label">Degraded</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Open Tickets</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">99.8%</div>
                    <div className="stat-label">Uptime (30d)</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Access</h2>
                <div className="grid grid-3">
                    <Link href="/explore" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🗄️</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                System Catalog
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                View all systems and their health status
                            </p>
                        </div>
                    </Link>

                    <Link href="/api-explorer" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📚</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                API Documentation
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Browse API docs for troubleshooting
                            </p>
                        </div>
                    </Link>

                    <Link href="/crm/contacts" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👤</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                Contact Lookup
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Find customer contacts for support
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* System Status */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>System Status</h2>
                    <span className="badge badge-secondary">8 Systems</span>
                </div>

                <div className="grid grid-2">
                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-md">
                            <div className="flex items-center gap-md">
                                <span style={{ fontSize: '1.5rem' }}>🔌</span>
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Customer API</h4>
                            </div>
                            <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>
                                <span className="status-dot healthy"></span>
                                Healthy
                            </span>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>
                            All endpoints responding normally
                        </p>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                            Last checked: 2 minutes ago
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="flex items-center justify-between mb-md">
                            <div className="flex items-center gap-md">
                                <span style={{ fontSize: '1.5rem' }}>🗄️</span>
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Analytics DB</h4>
                            </div>
                            <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>
                                <span className="status-dot degraded"></span>
                                Degraded
                            </span>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-sm)', color: 'var(--color-warning)' }}>
                            Slow query performance detected
                        </p>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                            Last checked: 1 minute ago
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Incidents */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Support Activity</h2>
                <div className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Slow API Response - Customer Endpoint
                                    </h4>
                                    <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>In Progress</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>30 min ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Investigating high latency on /customers endpoint
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Authentication Timeout Issue
                                    </h4>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Resolved</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>2 hours ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                OAuth token refresh fixed by restarting service
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Database Connection Pool Exhausted
                                    </h4>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Resolved</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Yesterday</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Increased connection pool size from 10 to 20
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Knowledge Base */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Knowledge Base</h2>
                <div className="grid grid-3">
                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>📘</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Troubleshooting Guides
                        </h4>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Step-by-step guides for common issues
                        </p>
                    </div>

                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>⚡</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Quick Fixes
                        </h4>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Common resolutions for frequent problems
                        </p>
                    </div>

                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>📞</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Escalation Procedures
                        </h4>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            When and how to escalate issues
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
