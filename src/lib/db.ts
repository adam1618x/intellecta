import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var _prisma: PrismaClient | undefined;
    var _pool: Pool | undefined;
}

function getPool(): Pool {
    if (!global._pool) {
        global._pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    return global._pool;
}

function getPrisma(): PrismaClient {
    if (!global._prisma) {
        const adapter = new PrismaPg(getPool());
        global._prisma = new PrismaClient({
            adapter,
            log:
                process.env.NODE_ENV === "development"
                    ? ["query", "error", "warn"]
                    : ["error"],
        });
    }
    return global._prisma;
}

export const prisma = getPrisma();