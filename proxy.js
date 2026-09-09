import { NextResponse } from 'next/server'
import { UrlBackend } from './src/confic/urlExport';

// Define paths to protect (must match the matcher below)
const dropshippingPaths = ['/all-products', '/sub-category'];

export async function proxy(req) {
    const { pathname } = req.nextUrl;
    const isDropshippingPath = dropshippingPaths.some(path => pathname.startsWith(path));

    if (isDropshippingPath) {
        const cookieHeader = req.headers.get('cookie') || '';
        const authHeader = req.headers.get('authorization') || '';

        try {
            // Fetch user profile from backend to check role
            const res = await fetch(`${UrlBackend}/users/userprofile`, {
                headers: {
                    Cookie: cookieHeader,
                    ...(authHeader ? { Authorization: authHeader } : {}),
                },
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                const user = data?.user;

                if (user) {
                    const userRole = (user.role || '').toUpperCase();
                    const userRoles = (user.roles || []).map((r) => (r || '').toUpperCase());

                    const isAllowed =
                        userRole === 'DROPSHIPPING' ||
                        userRole === 'ADMIN' ||
                        userRoles.includes('DROPSHIPPING') ||
                        userRoles.includes('ADMIN');

                    if (isAllowed) {
                        return NextResponse.next();
                    }

                    // Logged-in user is a regular retail customer (not a dropshipper or admin)
                    return NextResponse.redirect(new URL('/forbidden', req.url));
                }
            }

            // If profile check returns 401 or network mismatch, proceed to client-side where withCredentials auth executes
            return NextResponse.next();
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/all-products',
        '/sub-category/:path*',
    ],
};