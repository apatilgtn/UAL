'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { UserRole, getRoleName, getRoleBadgeColor } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auto-redirect to role-specific dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const role = session.user.role as UserRole;
      switch (role) {
        case UserRole.DEVELOPER:
          router.push('/dashboard/developer');
          break;
        case UserRole.SUPPORT:
          router.push('/dashboard/support');
          break;
        case UserRole.PRODUCT_MANAGER:
          router.push('/dashboard/product');
          break;
        case UserRole.ADMIN:
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/developer');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
          Loading...
        </p>
      </div>
    );
  }

  const userRole = (session?.user?.role as UserRole) || UserRole.DEVELOPER;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <div className="text-center" style={{ padding: '3rem 0' }}>
        <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>
          Universal Access Layer
        </h1>
        <p style={{ fontSize: 'var(--font-size-lg)', maxWidth: '600px', margin: '0 auto var(--spacing-xl) auto', color: 'var(--color-text-secondary)' }}>
          Your centralized platform for managing systems, APIs, and data across your organization
        </p>
        <div className="flex items-center justify-center gap-md">
          <span className="badge badge-success" style={{ fontSize: 'var(--font-size-sm)' }}>
            <span className="status-dot healthy"></span>
            All Systems Operational
          </span>
          {session?.user && (
            <span
              className="badge"
              style={{
                fontSize: 'var(--font-size-sm)',
                background: `${getRoleBadgeColor(userRole)}20`,
                color: getRoleBadgeColor(userRole),
                border: `1px solid ${getRoleBadgeColor(userRole)}`
              }}
            >
              {getRoleName(userRole)}
            </span>
          )}
        </div>
      </div>

      {/* Dashboard Selection */}
      {session?.user && (
        <div className="section">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            Choose Your Dashboard
          </h2>
          <div className="grid grid-4">
            <Link href="/dashboard/developer" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>👨‍💻</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                  Developer
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  API tools, documentation, and assigned systems
                </p>
              </div>
            </Link>

            <Link href="/dashboard/support" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>🛠️</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                  Support
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  System health, incidents, and troubleshooting
                </p>
              </div>
            </Link>

            <Link href="/dashboard/product" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📊</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                  Product Manager
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Analytics, documentation, and customer insights
                </p>
              </div>
            </Link>

            <Link href="/dashboard/admin" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>🔐</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                  Admin
                </h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                  User management and platform configuration
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Platform Stats */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Platform Overview
        </h2>
        <div className="grid grid-4">
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="stat-value">8</div>
            <div className="stat-label">Connected Systems</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <div className="stat-value">127</div>
            <div className="stat-label">API Endpoints</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="stat-value">42</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          Quick Access
        </h2>
        <div className="grid grid-3">
          <Link href="/explore" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🗄️</div>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                System Catalog
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                Browse all connected systems and their metadata
              </p>
            </div>
          </Link>

          <Link href="/api-explorer" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🔌</div>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                API Explorer
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                Discover and test API endpoints across systems
              </p>
            </div>
          </Link>

          <Link href="/crm" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>👥</div>
              <h3 style={{ marginBottom: 'var(--spacing-sm)', fontSize: 'var(--font-size-lg)' }}>
                CRM
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>
                Manage contacts, deals, and customer relationships
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
