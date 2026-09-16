import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: JWTPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("8h")
        .sign(secret);
}

export async function verifyToken(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
}