'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function ProductManagerDashboard() {
    const { data: session } = useSession();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '0.5rem' }}>Product Manager Dashboard</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Welcome, {session?.user?.name}! Manage documentation, analytics, and customer insights.
                </p>
            </div>

            {/*Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">24</div>
                    <div className="stat-label">APIs Published</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">18</div>
                    <div className="stat-label">Docs Updated</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">156</div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">94%</div>
                    <div className="stat-label">API Adoption</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h2>
                <div className="grid grid-3">
                    <Link href="/api-explorer" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📝</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                Edit API Docs
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Update API documentation and examples
                            </p>
                        </div>
                    </Link>

                    <Link href="/crm" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                Customer Insights
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                View CRM data and customer feedback
                            </p>
                        </div>
                    </Link>

                    <Link href="/explore" style={{ textDecoration: 'none' }}>
                        <div className="glass-card" style={{ cursor: 'pointer' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>📊</div>
                            <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                                API Analytics
                            </h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Monitor usage and performance metrics
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* API Usage Trends */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>API Usage Trends</h2>
                <div className="grid grid-2">
                    <div className="glass-card">
                        <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>Top APIs (Last 30 Days)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        /api/customers
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                        Customer API
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>145K</div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>+12%</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        /api/auth/token
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                        Authentication API
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>89K</div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>+8%</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                        /api/products
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                        Product Catalog API
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>62K</div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>-3%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h4 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>Documentation Health</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            <div>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>Complete Documentation</span>
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>20/24</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '83%', height: '100%', background: 'var(--color-success)' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>Has Examples</span>
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>18/24</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '75%', height: '100%', background: 'var(--color-primary)' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-sm">
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>Updated (&lt; 3 months)</span>
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>22/24</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: '92%', height: '100%', background: 'var(--color-success)' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Documentation Updates */}
            <div className="section">
                <div className="flex justify-between items-center mb-lg">
                    <h2 style={{ margin: 0 }}>Recent Documentation Updates</h2>
                    <button className="btn btn-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                        + Add Documentation
                    </button>
                </div>
                <div className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        New webhook documentation published
                                    </h4>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Published</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Today</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Complete webhook integration guide with event types and payload examples
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Updated authentication flow diagram
                                    </h4>
                                    <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>Updated</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Yesterday</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Refreshed OAuth 2.0 flow diagram with clearer visual representation
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Added rate limiting documentation
                                    </h4>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Published</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>2 days ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Documented rate limiting policies and best practices for all APIs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Feedback */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Customer Feedback</h2>
                <div className="grid grid-2">
                    <div className="glass-card">
                        <div className="flex items-start gap-md mb-md">
                            <div style={{ fontSize: '1.5rem' }}>⭐</div>
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-sm mb-sm">
                                    <span style={{ fontWeight: '600', fontSize: 'var(--font-size-sm)' }}>Sarah Johnson</span>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Positive</span>
                                </div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                                    "The new API documentation is much clearer and easier to follow. Great improvements!"
                                </p>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                    Customer API • 2 days ago
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div className="flex items-start gap-md mb-md">
                            <div style={{ fontSize: '1.5rem' }}>💡</div>
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center gap-sm mb-sm">
                                    <span style={{ fontWeight: '600', fontSize: 'var(--font-size-sm)' }}>Michael Chen</span>
                                    <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>Suggestion</span>
                                </div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                                    "Would be helpful to have more code examples in different programming languages"
                                </p>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                    Authentication API • 4 days ago
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
