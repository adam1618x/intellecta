// src/lib/publications.ts
//
// All public reads of Publication data go through the cached helpers below
// instead of calling `prisma` directly. Prisma queries aren't `fetch()`, so
// Next.js can't cache them on its own — `unstable_cache` gives us the same
// effect by hand: each helper's result is reused for `revalidate` seconds
// (per unique set of arguments), which cuts DB round-trips on repeat page
// views without going stale for more than a minute.
//
// Cache tags let the admin CRUD routes invalidate just the affected data the
// moment something is created/edited/deleted, instead of waiting out the
// 60s window (see revalidateTag calls in the publications API routes).
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";

const VALID_CATEGORIES = ["courses", "programming", "mathematics", "sciences", "business", "languages"] as const;
type CategoryKey = (typeof VALID_CATEGORIES)[number];

const REVALIDATE_SECONDS = 60;

// Tag shared by every cached read below. `unstable_cache`'s `tags` option is
// fixed at declaration time (it can't vary per call argument), so rather than
// fake per-category/per-id tags that would never actually attach, everything
// shares one tag and a write invalidates all publication reads at once. For
// this site's traffic and write volume that's effectively free — it just
// means one extra Postgres round-trip on the next page view after an edit,
// not a real cost.
const ALL_PUBLICATIONS_TAG = "publications";

// ── Home page: latest publication per category ───────────────────────────────
export const getLatestCourseByCategory = unstable_cache(
    async (category: CategoryKey, locale: string) => {
        const publications = await prisma.publication.findMany({
            where: { category },
            take: 1,
            orderBy: { publishedAt: "desc" },
            include: {
                translations: { where: { locale } },
            },
        });

        return publications.map((pub) => {
            const t =
                pub.translations.find((translation) => translation.locale === locale) ??
                pub.translations.find((translation) => translation.locale === "en") ??
                pub.translations[0];
            return {
                id: pub.id,
                category: pub.category,
                author: pub.author,
                publishedAt: pub.publishedAt,
                title: t?.title ?? null,
                excerpt: t?.excerpt ?? null,
            };
        });
    },
    ["publications-latest-by-category"],
    { revalidate: REVALIDATE_SECONDS, tags: [ALL_PUBLICATIONS_TAG] }
);

// ── Publications list (paginated), used by both the public listing page and
//    GET /api/courses/:category ──────────────────────────────────────────
export const listPublicationsByCategory = unstable_cache(
    async (category: string, locale: string, page: number, limit: number) => {
        const skip = (page - 1) * limit;

        const [rows, total] = await prisma.$transaction([
            prisma.publication.findMany({
                where: { category },
                skip,
                take: limit,
                orderBy: { publishedAt: "desc" },
                include: { translations: { where: { locale } } },
            }),
            prisma.publication.count({ where: { category } }),
        ]);

        const data = rows.map((pub) => ({
            id: pub.id,
            category: pub.category,
            author: pub.author,
            publishedAt: pub.publishedAt,
            image: pub.image,
            enrolled: pub.enrolled,
            completed: pub.completed,
            title: (
                pub.translations.find((translation) => translation.locale === locale) ??
                pub.translations.find((translation) => translation.locale === "en") ??
                pub.translations[0]
            )?.title ?? null,
            excerpt: (
                pub.translations.find((translation) => translation.locale === locale) ??
                pub.translations.find((translation) => translation.locale === "en") ??
                pub.translations[0]
            )?.excerpt ?? null,
        }));

        return { data, total };
    },
    ["publications-list-by-category"],
    { revalidate: REVALIDATE_SECONDS, tags: [ALL_PUBLICATIONS_TAG] }
);

// ── Single publication (full detail, all translations), used by the article
//    page and GET /api/courses/:category/:id ────────────────────────────
export const getPublicationById = unstable_cache(
    async (id: number) => {
        return prisma.publication.findUnique({
            where: { id },
            include: { translations: true },
        });
    },
    ["publication-by-id"],
    { revalidate: REVALIDATE_SECONDS, tags: [ALL_PUBLICATIONS_TAG] }
);

// ── Related publications for the article page ────────────────────────────────
export const getRelatedPublications = unstable_cache(
    async (category: string, excludeId: number, locale: string) => {
        const rows = await prisma.publication.findMany({
            where: { category, id: { not: excludeId } },
            orderBy: { publishedAt: "desc" },
            take: 3,
            include: { translations: { where: { locale } } },
        });

        return rows.map((r) => ({
            id: r.id,
            title: (
                r.translations.find((translation) => translation.locale === locale) ??
                r.translations.find((translation) => translation.locale === "en") ??
                r.translations[0]
            )?.title ?? null,
            excerpt: (
                r.translations.find((translation) => translation.locale === locale) ??
                r.translations.find((translation) => translation.locale === "en") ??
                r.translations[0]
            )?.excerpt ?? null,
        }));
    },
    ["publications-related"],
    { revalidate: REVALIDATE_SECONDS, tags: [ALL_PUBLICATIONS_TAG] }
);

// ── Called from the admin CRUD routes after create/update/delete so visitors
//    see the change immediately instead of waiting up to 60s ─────────────────
//
// Next.js 16 made revalidateTag's second argument required — it's a "profile"
// that controls how long stale content may still be served while fresh data
// loads in the background. `{ expire: 0 }` means immediate expiration (no
// stale window at all), which is what we want here: this runs from a Route
// Handler right after a write, not a Server Action, so we can't use
// updateTag() (Server Actions only) and want the very next read to be fresh.
export function invalidatePublicationsCache() {
    revalidateTag(ALL_PUBLICATIONS_TAG, { expire: 0 });
}
