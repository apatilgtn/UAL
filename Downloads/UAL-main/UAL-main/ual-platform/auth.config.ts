import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnSignIn = nextUrl.pathname.startsWith('/auth/signin');

            if (isOnSignIn) {
                if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
                return true; // Allow access to sign-in page
            }

            return isLoggedIn; // Require auth for all other pages
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Will be populated in auth.ts
} satisfies NextAuthConfig;
