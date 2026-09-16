// src/app/api/resources/route.ts
// GET  /api/resources  → list all books (public)
// POST /api/resources  → create a book (admin only)

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { getBooks, invalidateBooksCache } from "@/lib/resources";

// ── GET /api/resources ────────────────────────────────────────────────────────────
export async function GET() {
    const books = await getBooks();
    return NextResponse.json({ data: books });
}

// ── POST /api/resources ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    const authError = await requireAuth(request);
    if (authError) return authError;

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

    if (!title?.trim()) {
        return NextResponse.json({ error: "title is required" }, { status: 422 });
    }

    const book = await prisma.book.create({
        data: {
            title: title.trim(),
            author: author?.trim() || null,
            description: description?.trim() || null,
            year: year?.trim() || null,
            pages: pages?.trim() || null,
            downloadUrl: downloadUrl?.trim() || null,
        },
    });

    // Make the new book show up on the next /resources page view immediately.
    invalidateBooksCache();

    return NextResponse.json(book, { status: 201 });
}