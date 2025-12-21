'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { exportContactsToCSV } from '@/lib/csv-export';

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    jobTitle: string;
    status: string;
    avatar: string;
    createdAt: Date;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);

    // Fetch contacts from Twenty CRM API
    useEffect(() => {
        async function fetchContacts() {
            try {
                setLoading(true);
                const response = await fetch('/api/crm/contacts');
                const data = await response.json();

                if (data.success) {
                    setContacts(data.data.contacts);
                } else {
                    setError(data.error || 'Failed to load contacts');
                }
            } catch (err) {
                setError('Failed to connect to Twenty CRM');
                console.error('Error fetching contacts:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchContacts();
    }, []);

    const handleCreateContact = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreating(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string || undefined,
            jobTitle: formData.get('jobTitle') as string || undefined,
        };

        try {
            const response = await fetch('/api/crm/contacts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                setShowAddModal(false);
                window.location.reload();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            alert('Failed to create contact');
        } finally {
            setCreating(false);
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="text-center" style={{ padding: '4rem 0' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
                        Loading contacts from Twenty CRM...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--color-danger)', marginBottom: 'var(--spacing-md)' }}>
                        ⚠️ Connection Error
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
                    <p style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                        Please check your Twenty CRM configuration in .env.local
                    </p>
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

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>Contacts</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Manage and organize your contacts
                </p>
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
                        placeholder="Search contacts by name, email, or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-md items-center justify-between">
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            STATUS
                        </label>
                        <select
                            className="input"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-md" style={{ marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => exportContactsToCSV(contacts)}
                            disabled={contacts.length === 0}
                        >
                            📥 Export CSV
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowAddModal(true)}
                        >
                            + Add Contact
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>All Contacts</h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredContacts.length > 0 ? (
                    <div className="grid grid-3">
                        {filteredContacts.map((contact) => (
                            <div key={contact.id} className="glass-card" style={{ cursor: 'pointer' }}>
                                <div className="flex items-center gap-md mb-md">
                                    <img
                                        src={contact.avatar}
                                        alt={`${contact.firstName} ${contact.lastName}`}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>
                                            {contact.firstName} {contact.lastName}
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                            {contact.jobTitle}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        COMPANY
                                    </div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{contact.company}</div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        EMAIL
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>{contact.email}</div>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        PHONE
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>{contact.phone}</div>
                                </div>

                                <div className="flex gap-sm" style={{ marginTop: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                                        📧 Email
                                    </button>
                                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>
                                        📞 Call
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card text-center" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <h3>No contacts found</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>

            {/* Add Contact Modal */}
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
                        <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Add New Contact</h2>

                        <form onSubmit={handleCreateContact}>
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">First Name *</label>
                                <input
                                    name="firstName"
                                    className="input"
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Last Name *</label>
                                <input
                                    name="lastName"
                                    className="input"
                                    placeholder="Doe"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Email *</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="input"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="input-label">Phone (International format)</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    className="input"
                                    placeholder="+61412345678 or +14155551234"
                                />
                                <small style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem', display: 'block' }}>
                                    Must start with + and country code
                                </small>
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label className="input-label">Job Title</label>
                                <input
                                    name="jobTitle"
                                    className="input"
                                    placeholder="Software Engineer"
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
                                    {creating ? 'Creating...' : 'Create Contact'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
