import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await verifyToken(token);
        return null; // null = auth passed, continue
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}