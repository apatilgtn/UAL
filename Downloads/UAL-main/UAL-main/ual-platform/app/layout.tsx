import type { Metadata } from "next";
import "./globals.css";
import { auth, signOut } from '@/auth';
import UserNav from '@/components/UserNav';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: "UAL Platform - Universal Access Layer",
  description: "Standardized interface to all your organization's systems and data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <Providers>
          <nav style={{
            background: 'rgba(13, 17, 23, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}>
            <div className="container">
              <div className="flex items-center justify-between" style={{ height: '56px' }}>
                <div className="flex items-center gap-lg">
                  <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      fontWeight: 800,
                      color: '#0d1117',
                      boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)'
                    }}>U</span>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em'
                    }}>
                      UAL Platform
                    </span>
                  </a>
                  {session?.user && (
                    <div className="flex gap-xs" style={{ marginLeft: '1.5rem' }}>
                      <a href="/" style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a1a1aa',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        transition: 'all 120ms ease'
                      }}>Dashboard</a>
                      <a href="/explore" style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a1a1aa',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        transition: 'all 120ms ease'
                      }}>Explore</a>
                      <a href="/database" style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a1a1aa',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        transition: 'all 120ms ease'
                      }}>Database</a>
                      <a href="/crm" style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a1a1aa',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        transition: 'all 120ms ease'
                      }}>CRM</a>
                      <a href="/api-explorer" style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#a1a1aa',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        textDecoration: 'none',
                        transition: 'all 120ms ease'
                      }}>APIs</a>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-sm">
                  {session?.user ? (
                    <UserNav
                      user={session.user}
                      onSignOut={async () => {
                        'use server';
                        await signOut({ redirectTo: '/auth/signin' });
                      }}
                    />
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#22c55e',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                        animation: 'pulse 2s infinite'
                      }}></span>
                      Operational
                    </span>
                  )}
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
          <footer style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            marginTop: '3rem',
            padding: '1.5rem 0',
            textAlign: 'center',
            color: '#52525b'
          }}>
            <div className="container">
              <p style={{ margin: 0, fontSize: '0.6875rem' }}>
                © 2024 UAL Platform. Powered by Twenty CRM.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
