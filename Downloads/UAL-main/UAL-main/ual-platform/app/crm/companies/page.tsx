'use client';

import { useState, useEffect } from 'react';
import { exportCompaniesToCSV } from '@/lib/csv-export';

interface Company {
    id: string;
    name: string;
    industry: string;
    size: string;
    revenue: number;
    website: string;
    address: string;
    createdAt: Date;
}

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Fetch companies from Twenty CRM API
    useEffect(() => {
        async function fetchCompanies() {
            try {
                setLoading(true);
                const response = await fetch('/api/crm/companies');
                const data = await response.json();

                if (data.success) {
                    setCompanies(data.data.companies);
                } else {
                    setError(data.error || 'Failed to load companies');
                }
            } catch (err) {
                setError('Failed to connect to Twenty CRM');
                console.error('Error fetching companies:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCompanies();
    }, []);

    const handleCreateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreating(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            domainName: formData.get('domainName') as string,
            employees: parseInt(formData.get('employees') as string) || undefined,
            address: {
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                country: formData.get('country') as string,
            }
        };

        try {
            const response = await fetch('/api/crm/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setShowAddModal(false);
                // Refresh company list
                window.location.reload();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Failed to create company');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="text-center" style={{ padding: '4rem 0' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                        Loading companies from Twenty CRM...
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

    const industries = Array.from(new Set(companies.map(c => c.industry)));

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = !searchQuery ||
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.address.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;

        return matchesSearch && matchesIndustry;
    });

    const formatRevenue = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>Companies</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Manage company accounts and organizations
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{companies.length}</div>
                    <div className="stat-label">Total Companies</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">{industries.length}</div>
                    <div className="stat-label">Industries</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">
                        {formatRevenue(companies.reduce((sum, c) => sum + c.revenue, 0))}
                    </div>
                    <div className="stat-label">Total Revenue</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">
                        {formatRevenue(companies.reduce((sum, c) => sum + c.revenue, 0) / companies.length || 0)}
                    </div>
                    <div className="stat-label">Avg Revenue</div>
                </div>
            </div>

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
                        placeholder="Search companies by name, industry, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-md items-center justify-between">
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            INDUSTRY
                        </label>
                        <select
                            className="input"
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Industries</option>
                            {industries.map(industry => (
                                <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-md" style={{ marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => exportCompaniesToCSV(companies)}
                            disabled={companies.length === 0}
                        >
                            📥 Export CSV
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Company
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>All Companies</h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredCompanies.length} compan{filteredCompanies.length !== 1 ? 'ies' : 'y'}
                    </span>
                </div>

                {filteredCompanies.length > 0 ? (
                    <div className="grid grid-2">
                        {filteredCompanies.map((company) => (
                            <div key={company.id} className="glass-card" style={{ cursor: 'pointer' }}>
                                <div className="flex items-start gap-md mb-md">
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: '1.5rem',
                                    }}>
                                        🏢
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>
                                            {company.name}
                                        </h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            {company.industry}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                            REVENUE
                                        </div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                            {formatRevenue(company.revenue)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                            SIZE
                                        </div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                            {company.size} employees
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        WEBSITE
                                    </div>
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                                        {company.website}
                                    </a>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        ADDRESS
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        {company.address}
                                    </div>
                                </div>

                                <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                                        View Details
                                    </button>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                                        View Contacts
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                        <h3>No companies found</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Add Company Modal */}
            {showAddModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowAddModal(false)}
                >
                    <div
                        className="glass-card"
                        style={{
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '2rem',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Company</h2>

                        <form onSubmit={handleCreateCompany}>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Company Name *</label>
                                <input
                                    name="name"
                                    className="input"
                                    placeholder="Acme Corp"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Website</label>
                                <input
                                    name="domainName"
                                    type="url"
                                    className="input"
                                    placeholder="https://acme.com"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Number of Employees</label>
                                <input
                                    name="employees"
                                    type="number"
                                    className="input"
                                    placeholder="100"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">City</label>
                                <input
                                    name="city"
                                    className="input"
                                    placeholder="San Francisco"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">State/Province</label>
                                <input
                                    name="state"
                                    className="input"
                                    placeholder="CA"
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label className="input-label">Country</label>
                                <input
                                    name="country"
                                    className="input"
                                    placeholder="United States"
                                />
                            </div>

                            <div className="flex gap-md">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={creating}
                                    style={{ flex: 1 }}
                                >
                                    {creating ? 'Creating...' : 'Create Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
