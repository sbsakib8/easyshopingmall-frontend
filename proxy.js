import { NextResponse } from 'next/server'
import { UrlBackend } from './src/confic/urlExport';

// Define paths to protect (must match the matcher below)
const dropshippingPaths = ['/all-products', '/sub-category'];

export async function proxy(req) {

    const { pathname } = req.nextUrl;
    const isDropshippingPath = dropshippingPaths.some(path => pathname.startsWith(path));

    if (isDropshippingPath) {
        const cookieHeader = req.headers.get('cookie') || '';

        try {
            // Fetch user profile from backend to check role
            
            const res = await fetch(`${UrlBackend}/users/userprofile`, {
                headers: {
                    Cookie: cookieHeader,
                },
                cache: 'no-store'
            });

            if (res.ok) {
                const data = await res.json();
                const user = data?.user;

                // Only allow access if role is DROPSHIPPING
                if (user && user.role === 'DROPSHIPPING') {
                    return NextResponse.next();
                }
            }

            // If unauthorized, redirect to forbidden page
            return NextResponse.redirect(new URL('/forbidden', req.url));
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            // Safety redirect on error
            return NextResponse.redirect(new URL('/forbidden', req.url));
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