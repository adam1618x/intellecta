// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const VALID_LOCALES = ["ar", "en", "fr", "ms"];

export async function POST(request: NextRequest) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

    const rl = rateLimit(ip, { limit: 30, windowSecs: 600 });
    if (!rl.success) {
        return NextResponse.json(
            { error: "Too many requests", retryAfterSecs: rl.retryAfterSecs },
            { status: 429, headers: { "Retry-After": String(rl.retryAfterSecs) } }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, subject, message, locale } = body as {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
        locale?: string;
    };

    const errors: string[] = [];
    if (!name?.trim()) errors.push("name is required");
    if (!email?.trim()) errors.push("email is required");
    if (!message?.trim()) errors.push("message is required");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errors.push("email is invalid");
    }

    if (errors.length > 0) {
        return NextResponse.json({ errors }, { status: 422 });
    }

    const resolvedLocale =
        locale && VALID_LOCALES.includes(locale) ? locale : "en";

    const contactMessage = await prisma.contactMessage.create({
        data: {
            name: name!.trim(),
            email: email!.trim().toLowerCase(),
            subject: subject?.trim() ?? null,
            message: message!.trim(),
            locale: resolvedLocale,
        },
    });

    return NextResponse.json({ id: contactMessage.id, success: true }, { status: 201 });
}

export async function GET(request: NextRequest) {
    const authError = await requireAuth(request);
    if (authError) return authError;

    const { searchParams } = request.nextUrl;
    const parsedPage = Number(searchParams.get("page") ?? "1");
    const parsedLimit = Number(searchParams.get("limit") ?? "20");
    const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
    const limit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0 ? Math.min(100, parsedLimit) : 20;
    const skip = (page - 1) * limit;

    const readParam = searchParams.get("read");
    const readFilter =
        readParam === "true" ? true : readParam === "false" ? false : undefined;
    const where = readFilter !== undefined ? { read: readFilter } : {};

    const [messages, total] = await prisma.$transaction([
        prisma.contactMessage.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
        data: messages,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}