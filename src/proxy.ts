// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { verifyToken } from "@/lib/jwt";

const locales = ["ar", "en", "fr", "ms"] as const;
const defaultLocale = "en";

const intlMiddleware = createIntlMiddleware({
    locales,
    defaultLocale,
    // English is the default entry experience, regardless of the visitor's
    // browser language or geographic location. Disabling automatic locale
    // detection keeps the root route deterministic; users can still switch
    // languages explicitly.
    localeDetection: false,
});

// ── Public paths inside /:locale/admin ────────────────────────────────────────
// Matched AFTER stripping the locale prefix.
const PUBLIC_ADMIN_SEGMENTS = ["/admin/login"];

// ── Public API routes (no token required) ─────────────────────────────────────
// Auth endpoints are always public regardless of method.
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/auth/logout"];

// Method-aware public routes: only the listed HTTP method is public;
// all other methods on the same path still require authentication.
//
//  GET  /api/resources                   → public book listing
//  GET  /api/resources/:id               → public single book
//  GET  /api/courses/:category  → public publication listing
//  GET  /api/courses/:cat/:id   → public single publication
//  POST /api/contact                 → public contact form submission
//
// Everything else (POST/PATCH/DELETE books, GET/PATCH/DELETE contact, etc.)
// is admin-only and goes through the token check below.
function isPublicApiRequest(method: string, pathname: string): boolean {
    // Auth routes — always public
    if (PUBLIC_API_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        return true;
    }

    // GET /api/resources and GET /api/resources/:id
    if (method === "GET" && /^\/api\/resources(\/\d+)?$/.test(pathname)) {
        return true;
    }

    // GET /api/courses/:category and GET /api/courses/:category/:id
    if (method === "GET" && /^\/api\/courses\/[^/]+(\/\d+)?$/.test(pathname)) {
        return true;
    }

    // POST /api/contact  (public contact form — no auth needed)
    if (method === "POST" && pathname === "/api/contact") {
        return true;
    }

    return false;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ── 1. ADMIN PAGE GUARD ────────────────────────────────────────────────────
    // Matches /:locale/admin/:path* — extract locale then the rest of the path.
    // The /admin segment is REQUIRED here; public locale routes like /ar or /ar/about
    // must not be caught by this guard.
    const adminMatch = pathname.match(
        /^\/(ar|en|fr|ms)(\/admin(?:\/.*)?)?$/
    );

    if (adminMatch && adminMatch[2]) {
        const locale = adminMatch[1];
        const afterLocale = adminMatch[2]; // e.g. "/admin/dashboard"

        if (afterLocale === "/admin" || afterLocale === "/admin/") {
            // /:locale/admin → redirect to dashboard (or login if unauthenticated)
            const token = request.cookies.get("token")?.value;
            if (!token) {
                return redirectToLogin(request, locale);
            }
            try {
                await verifyToken(token);
                return NextResponse.redirect(
                    new URL(`/${locale}/admin/dashboard`, request.url)
                );
            } catch {
                return clearTokenAndRedirect(request, locale, `/${locale}/admin/dashboard`);
            }
        }

        const isPublicAdminPath = PUBLIC_ADMIN_SEGMENTS.some(
            (p) => afterLocale === p || afterLocale.startsWith(p + "/")
        );

        if (isPublicAdminPath) {
            // Already authenticated → skip login page
            const token = request.cookies.get("token")?.value;
            if (token) {
                try {
                    await verifyToken(token);
                    return NextResponse.redirect(
                        new URL(`/${locale}/admin/dashboard`, request.url)
                    );
                } catch {
                    // Invalid token → clear and let them through to login.
                    // Still run intlMiddleware so requestLocale/messages match the URL.
                    const res = intlMiddleware(request);
                    res.cookies.set("token", "", { expires: new Date(0), path: "/" });
                    return res;
                }
            }
            return intlMiddleware(request);
        }

        // Protected admin page — valid token required
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return redirectToLogin(request, locale);
        }
        try {
            await verifyToken(token);
            // Run intlMiddleware (not a bare NextResponse.next()) so the
            // x-next-intl-locale header is attached — without it, i18n.ts's
            // requestLocale resolves to undefined and falls back to "en"
            // on every admin page regardless of the URL's locale segment.
            return intlMiddleware(request);
        } catch {
            return clearTokenAndRedirect(request, locale, pathname);
        }
    }

    // ── 2. API ROUTE GUARD ────────────────────────────────────────────────────
    if (pathname.startsWith("/api/")) {
        if (!isPublicApiRequest(request.method, pathname)) {
            const token = request.cookies.get("token")?.value;
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            try {
                await verifyToken(token);
            } catch {
                const res = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                res.cookies.set("token", "", { expires: new Date(0), path: "/" });
                return res;
            }
        }

        return NextResponse.next();
    }

    // ── 3. PUBLIC LOCALE ROUTING ──────────────────────────────────────────────
    return intlMiddleware(request);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function redirectToLogin(request: NextRequest, locale: string): NextResponse {
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
}

function clearTokenAndRedirect(
    request: NextRequest,
    locale: string,
    callbackPath: string
): NextResponse {
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", callbackPath);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("token", "", { expires: new Date(0), path: "/" });
    return res;
}

export const config = {
    matcher: [
        // Locale-prefixed admin pages
        "/:locale(ar|en|fr|ms)/admin/:path*",
        // API routes
        "/api/:path*",
        // Public locale pages — exclude Next internals and static files
        "/((?!_next|_vercel|favicon.ico|.*\\..*).*)",
    ],
};