// src/app/api/courses/[category]/route.ts
// GET  /api/courses/:category         → list publications (with pagination)
// POST /api/courses/:category         → create a new publication (admin only)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { listPublicationsByCategory, invalidatePublicationsCache } from "@/lib/courses";

const VALID_CATEGORIES = [
    "courses",
    "programming",
    "mathematics",
    "sciences",
    "business",
    "languages",
] as const;

type CategoryKey = (typeof VALID_CATEGORIES)[number];

function isValidCategory(value: string): value is CategoryKey {
    return VALID_CATEGORIES.includes(value as CategoryKey);
}

// ── GET /api/courses/:category ──────────────────────────────────────────
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    const { category } = await params;

    if (!isValidCategory(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const { searchParams } = request.nextUrl;
    const requestedLocale = searchParams.get("locale") ?? "en";
    const locale = ["ar", "en", "fr", "ms"].includes(requestedLocale) ? requestedLocale : "en";
    const parsedPage = Number(searchParams.get("page") ?? "1");
    const parsedLimit = Number(searchParams.get("limit") ?? "10");
    const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0 ? Math.min(50, parsedLimit) : 10;

    // content is intentionally omitted from list view; the cached helper
    // below already trims each row down to id/author/publishedAt/title/excerpt
    const { data, total } = await listPublicationsByCategory(category, locale, page, limit);

    return NextResponse.json({
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}

// ── POST /api/courses/:category ─────────────────────────────────────────
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ category: string }> }
) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { category } = await params;
    if (!isValidCategory(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
        author,
        publishedAt,
        translations,
    } = body as {
        author?: string;
        publishedAt?: string;
        translations?: Array<{
            locale: string;
            title: string;
            excerpt: string;
            content: string;
        }>;
    };

    if (!Array.isArray(translations) || translations.length === 0) {
        return NextResponse.json(
            { error: "At least one translation is required" },
            { status: 422 }
        );
    }

    const VALID_LOCALES = ["ar", "en", "fr", "ms"];
    const seenLocales = new Set<string>();
    for (const t of translations) {
        if (!VALID_LOCALES.includes(t.locale)) {
            return NextResponse.json(
                { error: `Invalid locale: ${t.locale}` },
                { status: 422 }
            );
        }
        if (seenLocales.has(t.locale)) {
            return NextResponse.json({ error: `Duplicate locale: ${t.locale}` }, { status: 422 });
        }
        seenLocales.add(t.locale);
        if (!t.title?.trim() || !t.excerpt?.trim() || !t.content?.trim()) {
            return NextResponse.json(
                { error: "Each translation must have title, excerpt, and content" },
                { status: 422 }
            );
        }
    }

    if (publishedAt !== undefined && Number.isNaN(new Date(publishedAt).getTime())) {
        return NextResponse.json({ error: "publishedAt must be a valid date" }, { status: 422 });
    }

    try {
        const publication = await prisma.publication.create({
            data: {
                category,
                author: author?.trim() ?? null,
                publishedAt: publishedAt ? new Date(publishedAt) : undefined,
                translations: {
                    create: translations.map((t) => ({
                        locale: t.locale,
                        title: t.title.trim(),
                        excerpt: t.excerpt.trim(),
                        content: t.content.trim(),
                    })),
                },
            },
            include: { translations: true },
        });

        // Make the new publication show up on the next page view instead of
        // waiting out the 60s cache window.
        invalidatePublicationsCache();

        return NextResponse.json(publication, { status: 201 });
    } catch (error: unknown) {
        console.error("[POST /api/courses/:category]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
