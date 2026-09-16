// src/app/api/courses/[category]/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { getPublicationById, invalidatePublicationsCache } from "@/lib/courses";

type Params = { params: Promise<{ category: string; id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
    const { category, id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { searchParams } = request.nextUrl;
    const localeParam = searchParams.get("locale");
    const locale = localeParam && ["ar", "en", "fr", "ms"].includes(localeParam) ? localeParam : null;

    // Cached helper always returns all translations; filter down to the
    // requested locale here if one was given, instead of re-querying.
    const publication = await getPublicationById(id);
    const filtered =
        publication && locale
            ? { ...publication, translations: publication.translations.filter((t) => t.locale === locale) }
            : publication;

    if (!filtered || filtered.category !== category) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(filtered);
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { category, id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing || existing.category !== category) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { author, publishedAt, translations } = body as {
        author?: string;
        publishedAt?: string;
        translations?: Array<{
            locale: string;
            title?: string;
            excerpt?: string;
            content?: string;
        }>;
    };

    const VALID_LOCALES = ["ar", "en", "fr", "ms"];

    if (publishedAt !== undefined && Number.isNaN(new Date(publishedAt).getTime())) {
        return NextResponse.json({ error: "publishedAt must be a valid date" }, { status: 422 });
    }
    if (Array.isArray(translations)) {
        const seenLocales = new Set<string>();
        for (const translation of translations) {
            if (!VALID_LOCALES.includes(translation.locale)) {
                return NextResponse.json({ error: `Invalid locale: ${translation.locale}` }, { status: 422 });
            }
            if (seenLocales.has(translation.locale)) {
                return NextResponse.json({ error: `Duplicate locale: ${translation.locale}` }, { status: 422 });
            }
            seenLocales.add(translation.locale);
        }
    }

    try {
        const updated = await prisma.$transaction(async (tx) => {
            const pub = await tx.publication.update({
                where: { id },
                data: {
                    ...(author !== undefined && { author: author?.trim() ?? null }),
                    ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
                },
            });

            if (Array.isArray(translations)) {
                for (const t of translations) {
                    if (!VALID_LOCALES.includes(t.locale)) {
                        throw new Error(`Invalid locale: ${t.locale}`);
                    }
                    await tx.publicationTranslation.upsert({
                        where: {
                            publicationId_locale: { publicationId: id, locale: t.locale },
                        },
                        create: {
                            publicationId: id,
                            locale: t.locale,
                            title: t.title ?? "",
                            excerpt: t.excerpt ?? "",
                            content: t.content ?? "",
                        },
                        update: {
                            ...(t.title !== undefined && { title: t.title }),
                            ...(t.excerpt !== undefined && { excerpt: t.excerpt }),
                            ...(t.content !== undefined && { content: t.content }),
                        },
                    });
                }
            }

            return tx.publication.findUnique({
                where: { id: pub.id },
                include: { translations: true },
            });
        });

        // Reflect the edit immediately instead of waiting out the 60s cache window.
        invalidatePublicationsCache();

        return NextResponse.json(updated);
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal server error";
        if (msg.startsWith("Invalid locale")) {
            return NextResponse.json({ error: msg }, { status: 422 });
        }
        console.error("[PATCH /api/courses/:category/:id]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { category, id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.publication.findUnique({ where: { id } });
    if (!existing || existing.category !== category) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.publication.delete({ where: { id } });

    // Remove it from the cached lists/detail views right away.
    invalidatePublicationsCache();

    return new NextResponse(null, { status: 204 });
}
