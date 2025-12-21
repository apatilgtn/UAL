'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CRMDashboard() {
    const router = useRouter();

    const stats = {
        totalContacts: 247,
        activeDeals: 156,
        pendingTasks: 42,
        pipelineValue: 1850000,
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>CRM Dashboard</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Manage contacts, track deals, and monitor your sales pipeline
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{stats.totalContacts}</div>
                    <div className="stat-label">Total Contacts</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">{stats.activeDeals}</div>
                    <div className="stat-label">Active Deals</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">{stats.pendingTasks}</div>
                    <div className="stat-label">Pending Tasks</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">${(stats.pipelineValue / 1000000).toFixed(1)}M</div>
                    <div className="stat-label">Pipeline Value</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="section mb-lg">
                <h2 className="mb-md">Quick Actions</h2>
                <div className="grid grid-4">
                    <button
                        className="glass-card"
                        onClick={() => router.push('/crm/contacts')}
                        style={{ cursor: 'pointer', textAlign: 'left', border: 'none', background: 'inherit' }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
                        <h4 style={{ marginBottom: '0.5rem' }}>View Contacts</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Browse and manage all contacts
                        </p>
                    </button>

                    <button
                        className="glass-card"
                        onClick={() => router.push('/crm/deals')}
                        style={{ cursor: 'pointer', textAlign: 'left', border: 'none', background: 'inherit' }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Sales Pipeline</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Track deals and opportunities
                        </p>
                    </button>

                    <button
                        className="glass-card"
                        onClick={() => router.push('/crm/tasks')}
                        style={{ cursor: 'pointer', textAlign: 'left', border: 'none', background: 'inherit' }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                        <h4 style={{ marginBottom: '0.5rem' }}>My Tasks</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            View and manage tasks
                        </p>
                    </button>

                    <button
                        className="glass-card"
                        onClick={() => router.push('/crm/companies')}
                        style={{ cursor: 'pointer', textAlign: 'left', border: 'none', background: 'inherit' }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏢</div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Companies</h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            Manage company records
                        </p>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="section">
                <h2 className="mb-md">Recent Activity</h2>
                <div className="glass-card">
                    <div className="flex justify-between items-center mb-md" style={{ padding: '1rem', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <div className="flex items-center gap-md">
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '600' }}>
                                JD
                            </div>
                            <div>
                                <div style={{ fontWeight: '500' }}>New contact added</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>John Doe from Acme Corp</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>2 hours ago</div>
                    </div>

                    <div className="flex justify-between items-center mb-md" style={{ padding: '1rem', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <div className="flex items-center gap-md">
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                💼
                            </div>
                            <div>
                                <div style={{ fontWeight: '500' }}>Deal moved to proposal stage</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Enterprise Deal - $250,000</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>5 hours ago</div>
                    </div>

                    <div className="flex justify-between items-center" style={{ padding: '1rem' }}>
                        <div className="flex items-center gap-md">
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                ✓
                            </div>
                            <div>
                                <div style={{ fontWeight: '500' }}>Task completed</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Follow-up call with Tech Innovations</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>1 day ago</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
