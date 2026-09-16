// src/components/public/PublicationsList.tsx
//
// Split out of the category page so that ONLY this component sits inside
// the <Suspense> boundary. The hero and category tabs in page.tsx stay
// mounted and visible the instant you click a tab; this is the piece that
// streams in while listPublicationsByCategory() resolves.
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { listPublicationsByCategory } from "@/lib/courses";
import CourseCard from "@/components/ui/CourseCard";
import type { CategoryKey } from "@/types";

const LIMIT = 10;

interface Props {
    categoryKey: CategoryKey;
    categorySlug: string;
    locale: string;
    page: number;
}

export default async function PublicationsList({
    categoryKey,
    categorySlug,
    locale,
    page,
}: Props) {
    const t = await getTranslations("publications");

    let publications: Awaited<ReturnType<typeof listPublicationsByCategory>>["data"] = [];
    let total = 0;
    let loadFailed = false;

    try {
        const { data, total: count } = await listPublicationsByCategory(
            categoryKey,
            locale,
            page,
            LIMIT
        );
        publications = data;
        total = count;
    } catch {
        loadFailed = true;
    }

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <section className="mx-auto max-w-5xl px-5 sm:px-8 py-8">
            {loadFailed ? (
                <div className="rounded-3xl border border-red-100 bg-red-50/70 px-6 py-16 text-center">
                    <p className="text-sm font-medium text-red-700">{t("error")}</p>
                </div>
            ) : publications.length === 0 ? (
                <div className="py-20 text-center">
                    <p
                        className="text-sm"
                        style={{
                            color: "var(--muted)",
                            fontFamily: "var(--font-arabic-body)",
                        }}
                    >
                        {t("empty")}
                    </p>
                </div>
            ) : (
                <>
                    {/* Result count */}
                    <p
                        className="mb-5 text-xs"
                        style={{ color: "var(--muted)", fontFamily: "sans-serif" }}
                    >
                        {total}
                    </p>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {publications.map((pub) => (
                            <CourseCard
                                key={pub.id}
                                href={`/${locale}/courses/${categorySlug}/${pub.id}`}
                                title={pub.title}
                                excerpt={pub.excerpt}
                                author={pub.author}
                                readMore={t("readMore")}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                    {page > 1 && (
                        <Link
                            href={`/${locale}/courses/${categorySlug}?page=${page - 1}`}
                            className="px-5 py-2 text-sm font-medium transition-all"
                            style={{
                                background: "var(--white)",
                                color: "var(--blue)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                fontFamily: "var(--font-arabic-body)",
                            }}
                        >
                            {t("prev")}
                        </Link>
                    )}
                    <span
                        className="text-sm px-3"
                        style={{ color: "var(--muted)", fontFamily: "sans-serif" }}
                    >
                        {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link
                            href={`/${locale}/courses/${categorySlug}?page=${page + 1}`}
                            className="px-5 py-2 text-sm font-medium transition-all"
                            style={{
                                background: "var(--blue)",
                                color: "var(--white)",
                                border: "1px solid var(--blue)",
                                borderRadius: "4px",
                                fontFamily: "var(--font-arabic-body)",
                            }}
                        >
                            {t("next")}
                        </Link>
                    )}
                </div>
            )}
        </section>
    );
}