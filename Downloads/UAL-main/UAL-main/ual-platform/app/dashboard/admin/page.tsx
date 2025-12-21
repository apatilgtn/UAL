'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: session } = useSession();

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Welcome, {session?.user?.name}! Complete platform control and user management.
                </p>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">42</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">8</div>
                    <div className="stat-label">Systems</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">127</div>
                    <div className="stat-label">API Endpoints</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">99.9%</div>
                    <div className="stat-label">Uptime</div>
                </div>
            </div>

            {/* Quick Admin Actions */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h2>
                <div className="grid grid-3">
                    <div className="glass-card" style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                            Manage Users
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Add, edit, or deactivate user accounts
                        </p>
                    </div>

                    <div className="glass-card" style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🔐</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                            Role Management
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Assign and modify user roles
                        </p>
                    </div>

                    <div className="glass-card" style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⚙️</div>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                            System Config
                        </h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Configure platform-wide settings
                        </p>
                    </div>
                </div>
            </div>

            {/* User Management */}
            <div className="section">
                <div className="flex justify-between items-center mb-lg">
                    <h2 style={{ margin: 0 }}>User Management</h2>
                    <button className="btn btn-primary" style={{ fontSize: 'var(--font-size-sm)' }}>
                        + Add User
                    </button>
                </div>

                <div className="glass-card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', fontSize: 'var(--font-size-sm)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Active</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right', fontSize: 'var(--font-size-xs)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <div className="flex items-center gap-sm">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>JD</div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>John Doe</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>john.doe@company.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge badge-primary" style={{ fontSize: 'var(--font-size-xs)' }}>Developer</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Active</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>2 hours ago</td>
                                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                        <button className="btn btn-ghost" style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}>Edit</button>
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <div className="flex items-center gap-sm">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>SJ</div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>Sarah Johnson</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>sarah.j@company.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge" style={{ background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', fontSize: 'var(--font-size-xs)' }}>Product Manager</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Active</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>5 hours ago</td>
                                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                        <button className="btn btn-ghost" style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}>Edit</button>
                                    </td>
                                </tr>

                                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <div className="flex items-center gap-sm">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: '600' }}>MC</div>
                                            <div>
                                                <div style={{ fontWeight: '500' }}>Michael Chen</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>m.chen@company.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>Support</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)' }}>
                                        <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>Active</span>
                                    </td>
                                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>1 day ago</td>
                                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                        <button className="btn btn-ghost" style={{ fontSize: 'var(--font-size-xs)', padding: 'var(--spacing-xs) var(--spacing-sm)' }}>Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* System Activity */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Recent Activity</h2>
                <div className="glass-card">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        New user registered - Emily Brown
                                    </h4>
                                    <span className="badge badge-success" style={{ fontSize: 'var(--font-size-xs)' }}>User Added</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>10 min ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Assigned Developer role with access to 5 systems
                            </p>
                        </div>

                        <div style={{ paddingBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        Role updated - Sarah Johnson
                                    </h4>
                                    <span className="badge badge-secondary" style={{ fontSize: 'var(--font-size-xs)' }}>Role Changed</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>2 hours ago</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Changed from Developer to Product Manager
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between items-start mb-sm">
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)', marginBottom: 'var(--spacing-xs)' }}>
                                        System configuration updated
                                    </h4>
                                    <span className="badge badge-warning" style={{ fontSize: 'var(--font-size-xs)' }}>Config Change</span>
                                </div>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>Yesterday</span>
                            </div>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                                Updated OAuth token expiry from 1h to 2h
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security & Audit */}
            <div className="section">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Security Overview</h2>
                <div className="grid grid-3">
                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>🔒</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Active Sessions
                        </h4>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>38</div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Currently active user sessions
                        </p>
                    </div>

                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>🛡️</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Failed Login Attempts
                        </h4>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>3</div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            Last 24 hours
                        </p>
                    </div>

                    <div className="glass-card">
                        <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>📋</div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-base)' }}>
                            Audit Log Entries
                        </h4>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '800', marginBottom: 'var(--spacing-xs)' }}>847</div>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                            This month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
