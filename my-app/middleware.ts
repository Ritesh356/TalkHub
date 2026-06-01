// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

// Protect all routes by default, except the clerk webhook, sign-in, and sign-up
const isProtectedRoute = createRouteMatcher([
  '/((?!api/clerk-webhook|sign-in|sign-up).*)'
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if(!userId && isProtectedRoute(req)){
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)',
        // Always run for API routes
        '/(api|trpc)(.*)',
        '/'
    ],
}