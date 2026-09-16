// src/app/api/contact/[id]/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!message.read) {
        await prisma.contactMessage.update({
            where: { id },
            data: { read: true },
        });
        message.read = true;
    }

    return NextResponse.json(message);
}

export async function PATCH(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { read } = body as { read?: boolean };
    if (typeof read !== "boolean") {
        return NextResponse.json({ error: "`read` must be a boolean" }, { status: 422 });
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.contactMessage.update({
        where: { id },
        data: { read },
    });

    return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { id: rawId } = await params;
    const id = /^[1-9]\d*$/.test(rawId) ? Number(rawId) : NaN;
    if (!Number.isSafeInteger(id)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.contactMessage.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
}