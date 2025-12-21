'use client';

import { useState, useEffect } from 'react';

interface Column {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'boolean' | 'email';
    sortable?: boolean;
    filterable?: boolean;
}

interface DatabaseTableProps {
    tableName: string;
    columns: Column[];
    data: any[];
    onRefresh?: () => void;
    onCreate?: (data: any) => void;
    onUpdate?: (id: string, data: any) => void;
    onDelete?: (id: string) => void;
    loading?: boolean;
    realTime?: boolean;
    refreshInterval?: number; // milliseconds
}

export default function DatabaseTable({
    tableName,
    columns,
    data,
    onRefresh,
    onCreate,
    onUpdate,
    onDelete,
    loading = false,
    realTime = false,
    refreshInterval = 5000
}: DatabaseTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRow, setEditingRow] = useState<any | null>(null);

    // Real-time auto-refresh
    useEffect(() => {
        if (realTime && onRefresh && !loading) {
            const interval = setInterval(() => {
                onRefresh();
            }, refreshInterval);

            return () => clearInterval(interval);
        }
    }, [realTime, onRefresh, loading, refreshInterval]);

    // Filter data
    const filteredData = data.filter(row => {
        if (!searchQuery) return true;

        return columns.some(col => {
            const value = row[col.key];
            if (value == null) return false;
            return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortColumn) return 0;

        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(columnKey);
            setSortDirection('asc');
        }
    };

    const formatCellValue = (value: any, type: Column['type']) => {
        if (value == null) return '-';

        switch (type) {
            case 'date':
                return new Date(value).toLocaleDateString();
            case 'boolean':
                return value ? '✓' : '✗';
            case 'number':
                return typeof value === 'number' ? value.toLocaleString() : value;
            case 'email':
                return <a href={`mailto:${value}`} className="text-link">{value}</a>;
            default:
                return value;
        }
    };

    return (
        <div className="database-table">
            {/* Header Controls */}
            <div className="glass-card mb-lg">
                <div className="flex justify-between items-center mb-md">
                    <div>
                        <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{tableName}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                            {sortedData.length} record{sortedData.length !== 1 ? 's' : ''}
                            {realTime && <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>
                                <span className="status-dot healthy"></span>
                                Live
                            </span>}
                        </p>
                    </div>
                    <div className="flex gap-sm">
                        {onRefresh && (
                            <button
                                className="btn btn-secondary"
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                🔄 {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        )}
                        {onCreate && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCreateModal(true)}
                            >
                                + Add Record
                            </button>
                        )}
                    </div>
                </div>

                {/* Search */}
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
                        placeholder="Search across all columns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass-card" style={{ overflow: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem'
                }}>
                    <thead>
                        <tr style={{
                            borderBottom: '2px solid var(--color-border)',
                        }}>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                    style={{
                                        padding: '1rem',
                                        textAlign: 'left',
                                        fontWeight: 600,
                                        color: 'var(--color-text-primary)',
                                        cursor: col.sortable !== false ? 'pointer' : 'default',
                                        userSelect: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div className="flex items-center gap-sm">
                                        {col.label}
                                        {col.sortable !== false && sortColumn === col.key && (
                                            <span style={{ fontSize: '0.75rem' }}>
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onUpdate || onDelete) && (
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onUpdate || onDelete ? 1 : 0)} style={{ padding: '3rem', textAlign: 'center' }}>
                                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                                    <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading...</p>
                                </td>
                            </tr>
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (onUpdate || onDelete ? 1 : 0)} style={{ padding: '3rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                                    <p style={{ color: 'var(--color-text-secondary)' }}>No records found</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    style={{
                                        borderBottom: '1px solid var(--color-border)',
                                        transition: 'background-color var(--transition-fast)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {columns.map(col => (
                                        <td key={col.key} style={{ padding: '1rem' }}>
                                            {formatCellValue(row[col.key], col.type)}
                                        </td>
                                    ))}
                                    {(onUpdate || onDelete) && (
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div className="flex gap-sm justify-end">
                                                {onUpdate && (
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                                                        onClick={() => setEditingRow(row)}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', color: 'var(--color-danger)' }}
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this record?')) {
                                                                onDelete(row.id);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center" style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                        <div className="flex gap-sm items-center">
                            <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                Rows per page:
                            </label>
                            <select
                                className="input"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div className="flex gap-sm items-center">
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex gap-sm">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
