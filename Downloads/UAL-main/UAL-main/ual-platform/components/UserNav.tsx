'use client';

import { useState, useRef, useEffect } from 'react';

interface UserNavProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    onSignOut: () => void;
}

export default function UserNav({ user, onSignOut }: UserNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = user.name
        ? user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : user.email?.[0].toUpperCase() || 'U';

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                }}
            >
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name || 'User'}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.875rem',
                        }}
                    >
                        {initials}
                    </div>
                )}
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {user.name || 'User'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        {user.email}
                    </div>
                </div>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    style={{
                        transition: 'transform 0.2s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="glass-card"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        minWidth: '240px',
                        padding: '0.5rem',
                        zIndex: 50,
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                            {user.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                            {user.email}
                        </div>
                    </div>

                    <div style={{ padding: '0.5rem 0' }}>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // You can add profile navigation here
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            👤 Profile
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                // You can add settings navigation here
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(148, 163, 184, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            ⚙️ Settings
                        </button>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(148, 163, 184, 0.1)', padding: '0.5rem 0' }}>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                onSignOut();
                            }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                textAlign: 'left',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.875rem',
                                color: 'var(--color-error)',
                                transition: 'background 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            🚪 Sign Out
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
