// src/app/api/resources/[id]/route.ts
// GET    /api/resources/:id  → get single book
// PATCH  /api/resources/:id  → update book (admin only)
// DELETE /api/resources/:id  → delete book (admin only)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { invalidateBooksCache } from "@/lib/resources";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/resources/:id ────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(book);
}

// ── PATCH /api/resources/:id ──────────────────────────────────────────────────────
export async function PATCH(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { title, author, description, year, pages, downloadUrl } = body as {
        title?: string;
        author?: string;
        description?: string;
        year?: string;
        pages?: string;
        downloadUrl?: string;
    };

    if (title !== undefined && !title.trim()) {
        return NextResponse.json({ error: "title cannot be empty" }, { status: 422 });
    }

    const updated = await prisma.book.update({
        where: { id },
        data: {
            ...(title !== undefined && { title: title.trim() }),
            ...(author !== undefined && { author: author.trim() || null }),
            ...(description !== undefined && { description: description.trim() || null }),
            ...(year !== undefined && { year: year.trim() || null }),
            ...(pages !== undefined && { pages: pages.trim() || null }),
            ...(downloadUrl !== undefined && { downloadUrl: downloadUrl.trim() || null }),
        },
    });

    invalidateBooksCache();

    return NextResponse.json(updated);
}

// ── DELETE /api/resources/:id ─────────────────────────────────────────────────────
export async function DELETE(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.book.delete({ where: { id } });

    invalidateBooksCache();

    return NextResponse.json({ deleted: true });
}
