// src/lib/resources.ts
//
// Same idea as publications.ts: Prisma reads aren't fetch(), so Next can't
// cache them by itself. `unstable_cache` reuses the book list for 60s, and
// the admin books CRUD routes call `invalidateBooksCache()` right after a
// write so a new/edited/deleted book shows up on the next page view instead
// of waiting out the window.
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";

const REVALIDATE_SECONDS = 60;
const BOOKS_TAG = "books";

export const getBooks = unstable_cache(
    async () => {
        return prisma.book.findMany({ orderBy: { createdAt: "asc" } });
    },
    ["books-list"],
    { revalidate: REVALIDATE_SECONDS, tags: [BOOKS_TAG] }
);

// See the matching comment in publications.ts — Next.js 16 requires a second
// "profile" argument here; { expire: 0 } means no stale window at all, since
// this runs from a Route Handler right after a write.
export function invalidateBooksCache() {
    revalidateTag(BOOKS_TAG, { expire: 0 });
}
