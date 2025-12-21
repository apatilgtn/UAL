import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnSignIn = req.nextUrl.pathname.startsWith('/auth/signin');

    // Redirect to sign-in if not logged in and not on sign-in page
    if (!isLoggedIn && !isOnSignIn) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Redirect to home if logged in and on sign-in page
    if (isLoggedIn && isOnSignIn) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
