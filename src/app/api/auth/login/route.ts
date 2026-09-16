// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const limit = rateLimit(ip, { limit: 5, windowSecs: 60 });
    if (!limit.success) {
        return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }

    const { username, password } = await req.json();

    if (!username || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });

    if (!admin) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ id: admin.id, username: admin.username });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
    });

    return response;
}