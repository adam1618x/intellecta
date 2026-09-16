import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CATEGORIES, type CategoryKey } from "@/types";
import CourseList from "@/components/public/CourseList";

interface Props {
    params: Promise<{ locale: string; category: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function CourseListPage({ params, searchParams }: Props) {
    const { category: categorySlug } = await params;
    const { page: pageParam } = await searchParams;
    const locale = await getLocale();

    const parsedPage = Number(pageParam ?? "1");
    const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    const activeCategory = CATEGORIES.find((c) => c.slug === categorySlug);
    if (!activeCategory) notFound();
    const activeKey = activeCategory.key as CategoryKey;
    const activeSlug = activeCategory.slug;

    return (
        // ── The ONLY part that re-suspends on category/page change. The `key`
        //    forces React to drop the old subtree and show the fallback instead
        //    of freezing the previous category's stale content. Hero + tabs now
        //    live in layout.tsx and are unaffected by this. ──
        <Suspense key={`${activeKey}-${page}`} fallback={<CourseListSkeleton />}>
            <CourseList
                categoryKey={activeKey}
                categorySlug={activeSlug}
                locale={locale}
                page={page}
            />
        </Suspense>
    );
}

function CourseListSkeleton() {
    return (
        <section className="mx-auto max-w-5xl px-5 sm:px-8 py-8">
            <div className="mb-5 h-3 w-10 animate-pulse rounded-full bg-black/10" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl border p-5"
                        style={{ borderColor: "var(--border)", background: "rgba(0,0,0,0.03)" }}
                    >
                        <div className="mb-3 h-4 w-3/4 rounded-full bg-black/10" />
                        <div className="mb-2 h-3 w-full rounded-full bg-black/10" />
                        <div className="mb-2 h-3 w-5/6 rounded-full bg-black/10" />
                        <div className="h-3 w-1/2 rounded-full bg-black/10" />
                    </div>
                ))}
            </div>
        </section>
    );
}
