'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@/lib/rbac';
import Link from 'next/link';

export default function DeveloperDashboard() {
    const { data: session } = useSession();

    const userRole = (session?.user?.role as UserRole) || UserRole.DEVELOPER;

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '0.5rem' }}>Developer Dashboard</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Welcome back, {session?.user?.name || 'Developer'}! Here's your workspace.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Assigned APIs</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">8</div>
                    <div className="stat-label">Docs Updated</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">3</div>
                    <div className="stat-label">Pending Tests</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">24</div>
                    <div className="stat-label">Code Reviews</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h2>
                <div className="grid grid-3">
                    <Link href="/api-explorer" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🔍</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                Browse APIs
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Explore and test API endpoints across all systems
                            </p>
                        </div>
                    </Link>

                    <Link href="/explore" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🗄️</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                System Catalog
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                View and update system metadata and documentation
                            </p>
                        </div>
                    </Link>

                    <div className="glass-card" style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🧪</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                            Testing Tools
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Run tests and validate API responses
                        </p>
                    </div>
                </div>
            </div>

            {/* My Assigned Systems */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>My Assigned Systems</h2>
                    <span className="badge badge-secondary">5 Systems</span>
                </div>

                <div className="grid grid-2">
                    <div className="glass-card">
                        <div className="flex items-center gap-md mb-md">
                            <span style={{ fontSize: '1.5rem' }}>🔌</span>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Customer API</h4>
                                <span className="badge badge-success" style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)' }}>
                                    Healthy
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                            REST API for customer data management
                        </p>
                        <div className="flex gap-sm">
                            <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>8 Endpoints</span>
                            <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>REST API</span>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="flex items-center gap-md mb-md">
                            <span style={{ fontSize: '1.5rem' }}>🗄️</span>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Analytics DB</h4>
                                <span className="badge badge-warning" style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)' }}>
                                    Degraded
                                </span>
                            </div>
                        </div>
                        <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                            PostgreSQL database for analytics data
                        </p>
                        <div className="flex gap-sm">
                            <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>12 Tables</span>
                            <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>Database</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documentation Updates */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Documentation Updates</h2>
                <div className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Updated GET /customers endpoint</h4>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>2 hours ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Added pagination parameters and response examples
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Fixed typo in authentication docs</h4>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Yesterday</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Corrected OAuth flow diagram
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-sm">
                                <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>Added new webhook documentation</h4>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>3 days ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Documented webhook events and payload structure
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
