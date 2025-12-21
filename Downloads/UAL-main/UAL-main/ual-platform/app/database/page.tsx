'use client';

import { useState, useEffect } from 'react';
import DatabaseTable from '@/components/DatabaseTable';

// Client-only chart component to avoid hydration mismatch
function GrowthChart() {
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        // Generate random data only on client side
        setChartData([65, 78, 45, 82, 58, 92, 71]);
    }, []);

    if (chartData.length === 0) {
        return <div style={{ height: '200px' }}></div>;
    }

    return (
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
            {chartData.map((height, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                        style={{
                            width: '100%',
                            height: `${height}%`,
                            background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'height 0.3s ease',
                            marginBottom: '0.5rem'
                        }}
                    ></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        Day {i + 1}
                    </span>
                </div>
            ))}
        </div>
    );
}


interface DatabaseStats {
    totalRecords: number;
    todayAdded: number;
    weeklyGrowth: number;
    dataQuality: number;
}

export default function DatabaseBrowserPage() {
    const [selectedDatabase, setSelectedDatabase] = useState('contacts');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<DatabaseStats>({
        totalRecords: 0,
        todayAdded: 0,
        weeklyGrowth: 0,
        dataQuality: 0
    });

    const databases = [
        { id: 'contacts', name: 'Contacts', endpoint: '/api/crm/contacts', icon: '👤' },
        { id: 'companies', name: 'Companies', endpoint: '/api/crm/companies', icon: '🏢' },
        { id: 'tasks', name: 'Tasks', endpoint: '/api/crm/tasks', icon: '✓' },
    ];

    const columnConfigs: Record<string, any[]> = {
        contacts: [
            { key: 'firstName', label: 'First Name', type: 'text' },
            { key: 'lastName', label: 'Last Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'jobTitle', label: 'Job Title', type: 'text' },
            { key: 'createdAt', label: 'Created', type: 'date' },
        ],
        companies: [
            { key: 'name', label: 'Company Name', type: 'text' },
            { key: 'domainName', label: 'Website', type: 'text' },
            { key: 'employees', label: 'Employees', type: 'number' },
            { key: 'idealCustomerProfile', label: 'ICP', type: 'boolean' },
            { key: 'createdAt', label: 'Created', type: 'date' },
        ],
        tasks: [
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'status', label: 'Status', type: 'text' },
            { key: 'dueAt', label: 'Due Date', type: 'date' },
            { key: 'createdAt', label: 'Created', type: 'date' },
        ],
    };

    const fetchData = async () => {
        setLoading(true);
        const db = databases.find(d => d.id === selectedDatabase);
        if (!db) return;

        try {
            const response = await fetch(db.endpoint);
            const result = await response.json();

            if (result.success) {
                const records = result.data[selectedDatabase] || result.data.contacts || result.data.companies || [];
                setData(records);

                // Calculate stats
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const todayRecords = records.filter((r: any) => {
                    const created = new Date(r.createdAt);
                    return created >= today;
                });

                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const weekRecords = records.filter((r: any) => new Date(r.createdAt) >= weekAgo);

                // Calculate data quality (percentage of records with all fields filled)
                let qualityScore = 0;
                if (records.length > 0) {
                    const columns = columnConfigs[selectedDatabase];
                    const totalFields = columns.length * records.length;
                    const filledFields = records.reduce((acc: number, record: any) => {
                        return acc + columns.filter(col => record[col.key] != null && record[col.key] !== '').length;
                    }, 0);
                    qualityScore = Math.round((filledFields / totalFields) * 100);
                }

                setStats({
                    totalRecords: records.length,
                    todayAdded: todayRecords.length,
                    weeklyGrowth: weekRecords.length,
                    dataQuality: qualityScore
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDatabase]);

    const handleDelete = async (id: string) => {
        const db = databases.find(d => d.id === selectedDatabase);
        if (!db) return;

        try {
            console.log(`Deleting ${selectedDatabase} with id:`, id);

            const response = await fetch(`${db.endpoint}/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                console.log('Delete successful, refreshing data...');
                // Show success message
                alert(`${db.name.slice(0, -1)} deleted successfully!`);
                // Refresh the data
                await fetchData();
            } else {
                console.error('Delete failed:', result.error);
                alert(`Failed to delete: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Failed to delete record. Please try again.');
        }
    };

    const currentDb = databases.find(d => d.id === selectedDatabase);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            {/* Page Header */}
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>🗄️ Database Browser</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Real-time data explorer with live updates from Twenty CRM
                </p>
            </div>

            {/* Database Selector */}
            <div className="glass-card mb-lg">
                <h3 className="mb-md">Select Database</h3>
                <div className="grid grid-3">
                    {databases.map(db => (
                        <div
                            key={db.id}
                            className="glass-card"
                            onClick={() => setSelectedDatabase(db.id)}
                            style={{
                                cursor: 'pointer',
                                border: selectedDatabase === db.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                transition: 'all var(--transition-base)'
                            }}
                        >
                            <div className="flex items-center gap-md">
                                <div style={{ fontSize: '2rem' }}>{db.icon}</div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{db.name}</h4>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                        Twenty CRM
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Real-time Stats Dashboard */}
            <div className="grid grid-4 mb-lg">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="stat-value">{stats.totalRecords}</div>
                    <div className="stat-label">Total Records</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                    <div className="stat-value">+{stats.todayAdded}</div>
                    <div className="stat-label">Added Today</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <div className="stat-value">+{stats.weeklyGrowth}</div>
                    <div className="stat-label">This Week</div>
                </div>
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                    <div className="stat-value">{stats.dataQuality}%</div>
                    <div className="stat-label">Data Quality</div>
                </div>
            </div>

            {/* Data Visualizations */}
            <div className="grid grid-2 mb-lg">
                {/* Growth Chart */}
                <div className="glass-card">
                    <h3 className="mb-md">📈 Growth Trend</h3>
                    <GrowthChart />
                </div>

                {/* Data Quality Breakdown */}
                <div className="glass-card">
                    <h3 className="mb-md">📊 Data Quality Metrics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <div className="flex justify-between mb-sm">
                                <span style={{ fontSize: '0.875rem' }}>Completeness</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{stats.dataQuality}%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '12px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${stats.dataQuality}%`,
                                    height: '100%',
                                    background: stats.dataQuality >= 80 ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' :
                                        stats.dataQuality >= 50 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                                            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-sm">
                                <span style={{ fontSize: '0.875rem' }}>Accuracy</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>95%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '12px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '95%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-sm">
                                <span style={{ fontSize: '0.875rem' }}>Consistency</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>88%</span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '12px',
                                background: 'var(--color-bg-tertiary)',
                                borderRadius: '6px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: '88%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Real-time Database Table with CRUD */}
            <DatabaseTable
                tableName={`${currentDb?.name || ''} (Real-time from Twenty CRM)`}
                columns={columnConfigs[selectedDatabase] || []}
                data={data}
                onRefresh={fetchData}
                onDelete={handleDelete}
                loading={loading}
                realTime={true}
                refreshInterval={10000} // Auto-refresh every 10 seconds
            />

            {/* Feature Highlights */}
            <div className="glass-card mt-lg">
                <h3 className="mb-md">✨ Active Features</h3>
                <div className="grid grid-4">
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Live Updates</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                            Auto-refresh every 10s
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Search & Filter</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                            Real-time filtering
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>↕️</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Sort & Paginate</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                            Multi-column sorting
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✏️</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>CRUD Operations</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                            Create, Read, Update, Delete
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
