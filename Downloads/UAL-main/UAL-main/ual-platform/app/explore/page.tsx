'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { systems } from '../../lib/mock-data';
import SystemCard from '../../components/SystemCard';
import { SystemType } from '../../../ual-framework/core/interfaces';

export default function ExplorePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');

    const filteredSystems = systems.filter(system => {
        const matchesSearch = !searchQuery ||
            system.metadata.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            system.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            system.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedType === 'all' || system.metadata.type === selectedType;
        const matchesEnv = selectedEnvironment === 'all' || system.metadata.environment === selectedEnvironment;

        return matchesSearch && matchesType && matchesEnv;
    });

    const allDatasets = systems.flatMap(system =>
        system.dataCatalog.datasets.map(dataset => ({
            ...dataset,
            systemId: system.metadata.systemId,
            systemName: system.metadata.displayName
        }))
    );

    const filteredDatasets = allDatasets.filter(dataset =>
        !searchQuery ||
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div className="page-header">
                <h1 style={{ marginBottom: '1rem' }}>Explore Data & Systems</h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Search and filter across all available systems and datasets
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
                        placeholder="Search systems, datasets, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-md">
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            SYSTEM TYPE
                        </label>
                        <select
                            className="input"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Types</option>
                            <option value={SystemType.DATABASE}>Database</option>
                            <option value={SystemType.REST_API}>REST API</option>
                            <option value={SystemType.FILE_SYSTEM}>File System</option>
                            <option value={SystemType.MESSAGE_QUEUE}>Message Queue</option>
                            <option value={SystemType.STREAMING}>Streaming</option>
                            <option value={SystemType.LEGACY}>Legacy</option>
                            <option value={SystemType.SAAS}>SaaS</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem', display: 'block' }}>
                            ENVIRONMENT
                        </label>
                        <select
                            className="input"
                            value={selectedEnvironment}
                            onChange={(e) => setSelectedEnvironment(e.target.value)}
                            style={{ appearance: 'none', cursor: 'pointer' }}
                        >
                            <option value="all">All Environments</option>
                            <option value="production">Production</option>
                            <option value="staging">Staging</option>
                            <option value="development">Development</option>
                            <option value="test">Test</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="section">
                <div className="flex justify-between items-center mb-md">
                    <h2 style={{ margin: 0 }}>Systems</h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredSystems.length} result{filteredSystems.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredSystems.length > 0 ? (
                    <div className="grid grid-3 mb-lg">
                        {filteredSystems.map((system) => (
                            <SystemCard
                                key={system.metadata.systemId}
                                system={system}
                                onClick={() => router.push(`/systems/${system.metadata.systemId}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card text-center mb-lg" style={{ padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
                        <p style={{ color: 'var(--color-text-secondary)' }}>No systems found matching your criteria</p>
                    </div>
                )}

                <div className="flex justify-between items-center mb-md" style={{ marginTop: '3rem' }}>
                    <h2 style={{ margin: 0 }}>Datasets</h2>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                        {filteredDatasets.length} result{filteredDatasets.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {filteredDatasets.length > 0 ? (
                    <div className="grid grid-2">
                        {filteredDatasets.map((dataset, index) => (
                            <div key={index} className="glass-card" onClick={() => router.push(`/systems/${dataset.systemId}`)}>
                                <div className="flex justify-between items-center mb-md">
                                    <h4 style={{ margin: 0 }}>{dataset.name}</h4>
                                    <span className="badge badge-success">
                                        Quality: {dataset.quality.score}%
                                    </span>
                                </div>

                                <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                                    {dataset.description}
                                </p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: '0.25rem' }}>
                                        FROM SYSTEM
                                    </div>
                                    <div style={{ fontSize: '0.875rem' }}>{dataset.systemName}</div>
                                </div>

                                <div className="flex gap-md" style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                                    <div>
                                        <strong>{dataset.recordCount?.toLocaleString() || 'N/A'}</strong> records
                                    </div>
                                    <div>
                                        <strong>{dataset.schema.fields.length}</strong> fields
                                    </div>
                                    <div>
                                        <strong>{dataset.format}</strong>
                                    </div>
                                </div>

                                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                                    {dataset.tags.map(tag => (
                                        <span key={tag} className="badge badge-secondary" style={{ fontSize: '0.625rem' }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card text-center" style={{ padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                        <p style={{ color: 'var(--color-text-secondary)' }}>No datasets found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
