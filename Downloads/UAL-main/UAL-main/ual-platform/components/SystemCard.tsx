'use client';

import { UALSystem, SystemType } from '../../ual-framework/core/interfaces';

interface SystemCardProps {
    system: UALSystem;
    onClick?: () => void;
}

const SystemTypeIcons: Record<SystemType, string> = {
    [SystemType.DATABASE]: '🗄️',
    [SystemType.REST_API]: '🔌',
    [SystemType.FILE_SYSTEM]: '📁',
    [SystemType.MESSAGE_QUEUE]: '📨',
    [SystemType.STREAMING]: '🌊',
    [SystemType.LEGACY]: '🏛️',
    [SystemType.SAAS]: '☁️',
    [SystemType.CRM]: '👥',
    [SystemType.CUSTOM]: '⚙️',
};

const SystemTypeLabels: Record<SystemType, string> = {
    [SystemType.DATABASE]: 'Database',
    [SystemType.REST_API]: 'REST API',
    [SystemType.FILE_SYSTEM]: 'File System',
    [SystemType.MESSAGE_QUEUE]: 'Message Queue',
    [SystemType.STREAMING]: 'Streaming',
    [SystemType.LEGACY]: 'Legacy System',
    [SystemType.SAAS]: 'SaaS',
    [SystemType.CRM]: 'CRM',
    [SystemType.CUSTOM]: 'Custom',
};

export default function SystemCard({ system, onClick }: SystemCardProps) {
    const { metadata, health, dataCatalog } = system;

    const icon = SystemTypeIcons[metadata.type] || '⚙️';
    const typeLabel = SystemTypeLabels[metadata.type] || 'System';

    const healthClass = health.status === 'healthy' ? 'healthy' :
        health.status === 'degraded' ? 'degraded' : 'unhealthy';

    const healthBadgeClass = health.status === 'healthy' ? 'badge-success' :
        health.status === 'degraded' ? 'badge-warning' : 'badge-danger';

    return (
        <div className="system-card" onClick={onClick}>
            <div className="flex justify-between items-center mb-md">
                <div className="flex items-center gap-sm">
                    <span style={{ fontSize: '2rem' }}>{icon}</span>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{metadata.displayName}</h4>
                        <span className="badge badge-primary" style={{ marginTop: '0.25rem' }}>
                            {typeLabel}
                        </span>
                    </div>
                </div>
                <span className={`badge ${healthBadgeClass}`}>
                    <span className={`status-dot ${healthClass}`}></span>
                    {health.status}
                </span>
            </div>

            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                {metadata.description}
            </p>

            <div className="flex gap-md" style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>
                        {dataCatalog.datasets.length}
                    </strong>{' '}
                    Dataset{dataCatalog.datasets.length !== 1 ? 's' : ''}
                </div>
                <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>
                        {system.endpoints.length}
                    </strong>{' '}
                    Endpoint{system.endpoints.length !== 1 ? 's' : ''}
                </div>
                <div>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>
                        {metadata.environment}
                    </strong>
                </div>
            </div>

            <div className="flex gap-sm" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                {metadata.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="badge badge-secondary" style={{ fontSize: '0.625rem' }}>
                        {tag}
                    </span>
                ))}
                {metadata.tags.length > 3 && (
                    <span className="badge badge-secondary" style={{ fontSize: '0.625rem' }}>
                        +{metadata.tags.length - 3} more
                    </span>
                )}
            </div>
        </div>
    );
}
