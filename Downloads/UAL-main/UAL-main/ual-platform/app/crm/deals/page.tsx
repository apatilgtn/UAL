'use client';

import { useState, useEffect } from 'react';

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';

const stageLabels: Record<DealStage, string> = {
    'lead': 'Lead',
    'qualified': 'Qualified',
    'proposal': 'Proposal',
    'negotiation': 'Negotiation',
    'closed-won': 'Closed Won',
    'closed-lost': 'Closed Lost',
};

const stageColors: Record<DealStage, string> = {
    'lead': '#94a3b8',
    'qualified': '#60a5fa',
    'proposal': '#a78bfa',
    'negotiation': '#f59e0b',
    'closed-won': '#10b981',
    'closed-lost': '#ef4444',
};

interface Deal {
    id: string;
    title: string;
    value: number;
    stage: DealStage;
    probability: number;
    expectedCloseDate: Date | null;
    contactId: string;
    contactName: string;
    companyName: string;
    owner: string;
    createdAt: Date;
}

export default function DealsPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch deals from Twenty CRM API
    useEffect(() => {
        async function fetchDeals() {
            try {
                setLoading(true);
                const response = await fetch('/api/crm/deals');
                const data = await response.json();

                if (data.success) {
                    const formattedDeals = data.data.deals.map((deal: any) => ({
                        ...deal,
                        expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate) : null,
                        createdAt: new Date(deal.createdAt),
                    }));
                    setDeals(formattedDeals);
                } else {
                    setError(data.error || 'Failed to load deals');
                }
            } catch (err) {
                setError('Failed to connect to Twenty CRM');
                console.error('Error fetching deals:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchDeals();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="text-center" style={{ padding: '4rem 0' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                        Loading deals from Twenty CRM...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--color-danger)' }}>⚠️ Connection Error</h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ marginTop: 'var(--spacing-lg)' }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const filteredDeals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.companyName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stageOrder: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
    const dealsByStage = stageOrder.reduce((acc, stage) => {
        acc[stage] = filteredDeals.filter(deal => deal.stage === stage);
        return acc;
    }, {} as Record<DealStage, Deal[]>);

    const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
    const averageValue = filteredDeals.length > 0 ? totalValue / filteredDeals.length : 0;
    const wonDeals = deals.filter(d => d.stage === 'closed-won');
    const wonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>Sales Pipeline</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Track and manage your sales opportunities
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{filteredDeals.length}</div>
                    <div className="stat-label">Total Deals</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">{formatCurrency(totalValue)}</div>
                    <div className="stat-label">Pipeline Value</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">{wonDeals.length}</div>
                    <div className="stat-label">Won Deals</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">{formatCurrency(wonValue)}</div>
                    <div className="stat-label">Won Value</div>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card mb-lg">
                <div className="search-bar">
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
                        placeholder="Search deals by title, contact, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Pipeline Stages */}
            {filteredDeals.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    {stageOrder.map(stage => (
                        <div key={stage} className="glass-card">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 'var(--spacing-md)',
                                paddingBottom: 'var(--spacing-sm)',
                                borderBottom: `2px solid ${stageColors[stage]}`
                            }}>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                                    {stageLabels[stage]}
                                </h3>
                                <span style={{
                                    background: stageColors[stage],
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600'
                                }}>
                                    {dealsByStage[stage].length}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {dealsByStage[stage].length > 0 ? (
                                    dealsByStage[stage].map(deal => (
                                        <div
                                            key={deal.id}
                                            className="glass-card"
                                            style={{
                                                padding: 'var(--spacing-md)',
                                                cursor: 'pointer',
                                                borderLeft: `3px solid ${stageColors[stage]}`
                                            }}
                                        >
                                            <h4 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '0.9375rem' }}>
                                                {deal.title}
                                            </h4>
                                            <div style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '600',
                                                color: 'var(--color-primary)',
                                                marginBottom: '0.5rem'
                                            }}>
                                                {formatCurrency(deal.value)}
                                            </div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                                <div>{deal.companyName}</div>
                                                <div>{deal.contactName}</div>
                                                {deal.expectedCloseDate && (
                                                    <div style={{ marginTop: '0.25rem' }}>
                                                        Close: {deal.expectedCloseDate.toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{
                                        padding: 'var(--spacing-lg)',
                                        textAlign: 'center',
                                        color: 'var(--color-text-tertiary)',
                                        fontSize: '0.875rem'
                                    }}>
                                        No deals
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💼</div>
                    <h3>No deals found</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                        {deals.length === 0
                            ? 'Start by creating your first deal in Twenty CRM'
                            : 'Try adjusting your search query'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
