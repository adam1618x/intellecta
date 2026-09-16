import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { IconBook, IconCalendar, IconUser } from "@tabler/icons-react";
import MarkdownContent from "@/components/content/MarkdownContent";
import BackButton from "@/components/public/BackButton";
import RelatedCard from "@/components/public/RelatedCard";
import { getPublicationById, getRelatedPublications } from "@/lib/courses";
import { CATEGORIES } from "@/types";

const DATE_LOCALES: Record<string, string> = {
    ar: "ar-TN",
    en: "en-GB",
    fr: "fr-FR",
    ms: "ms-MY",
};

interface Props {
    params: Promise<{ locale: string; category: string; id: string }>;
}

function parsePublicationId(rawId: string): number | null {
    if (!/^[1-9]\d*$/.test(rawId)) return null;

    const id = Number(rawId);
    return Number.isSafeInteger(id) ? id : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, category: categorySlug, id: rawId } = await params;
    const category = CATEGORIES.find((item) => item.slug === categorySlug);
    const id = parsePublicationId(rawId);

    if (!category || id === null) return {};

    const publication = await getPublicationById(id);
    if (!publication || publication.category !== category.key) return {};

    const translation =
        publication.translations.find((item) => item.locale === locale) ??
        publication.translations[0];

    if (!translation) return {};

    return {
        title: translation.title,
        description: translation.excerpt,
    };
}

export default async function ArticlePage({ params }: Props) {
    const { locale, category: categorySlug, id: rawId } = await params;
    const id = parsePublicationId(rawId);
    const category = CATEGORIES.find((item) => item.slug === categorySlug);

    if (id === null || !category) notFound();

    const [publication, related] = await Promise.all([
        getPublicationById(id),
        getRelatedPublications(category.key, id, locale),
    ]);

    if (!publication || publication.category !== category.key) notFound();

    const translation =
        publication.translations.find((item) => item.locale === locale) ??
        publication.translations[0];

    if (!translation) notFound();

    const t = await getTranslations("article");
    const tNav = await getTranslations("nav");
    const dir = locale === "ar" ? "rtl" : "ltr";
    const formattedDate = new Date(publication.publishedAt).toLocaleDateString(
        DATE_LOCALES[locale] ?? DATE_LOCALES.en,
        { year: "numeric", month: "long", day: "numeric" }
    );

    return (
        <div dir={dir} className="min-h-screen" style={{ background: "var(--cream)" }}>
            <section className="relative overflow-hidden" style={{ background: "var(--blue)" }}>
                <div
                    className="absolute top-0 inset-x-0 h-[3px]"
                    style={{ backgroundColor: "var(--blue)" }}
                />
                <div aria-hidden className="absolute inset-0 geo-pattern opacity-20" />

                <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:px-10">
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-6 flex flex-wrap items-center gap-2 text-xs"
                        style={{ color: "var(--blue-light)" }}
                    >
                        <Link href={`/${locale}`} className="transition-opacity hover:opacity-80">
                            {tNav("home")}
                        </Link>
                        <span aria-hidden>/</span>
                        <Link
                            href={`/${locale}/courses/${categorySlug}`}
                            className="transition-opacity hover:opacity-80"
                        >
                            {tNav(`categories.${category.key}`)}
                        </Link>
                        <span aria-hidden>/</span>
                        <span className="opacity-65" aria-current="page">
                            {translation.title.slice(0, 50)}
                            {translation.title.length > 50 ? "…" : ""}
                        </span>
                    </nav>

                    <div
                        className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur-sm"
                        style={{
                            color: "var(--blue-light)",
                            backgroundColor: "rgba(255,255,255,0.1)",
                        }}
                    >
                        <IconBook size={16} aria-hidden />
                        {tNav(`categories.${category.key}`)}
                    </div>

                    <h1
                        className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                        style={{
                            color: "var(--white)",
                            fontFamily: "var(--font-arabic-display)",
                            lineHeight: 1.5,
                        }}
                    >
                        {translation.title}
                    </h1>

                    <div
                        className="mt-6 flex flex-wrap items-center gap-5 text-sm"
                        style={{ color: "var(--blue-light)" }}
                    >
                        <div className="flex items-center gap-2">
                            <IconCalendar size={16} aria-hidden />
                            <span>
                                {t("publishedOn")} {formattedDate}
                            </span>
                        </div>
                        {publication.author && (
                            <div className="flex items-center gap-2">
                                <IconUser size={16} aria-hidden />
                                <span>
                                    {t("author")} : {publication.author}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <svg
                    viewBox="0 0 1440 40"
                    preserveAspectRatio="none"
                    aria-hidden
                    className="block w-full"
                    style={{ marginBottom: "-1px" }}
                >
                    <path
                        d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z"
                        fill="var(--cream)"
                    />
                </svg>
            </section>

            <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
                <article
                    className="rounded-3xl p-6 shadow-sm sm:p-10"
                    style={{ background: "var(--white)", border: "1px solid var(--border)" }}
                >
                    <div
                        className="mb-8 ps-5"
                        style={{ borderInlineStart: "3px solid var(--blue)" }}
                    >
                        <p
                            className="text-lg italic"
                            style={{
                                color: "var(--blue)",
                                fontFamily: "var(--font-arabic-display)",
                                lineHeight: 1.8,
                            }}
                        >
                            {translation.excerpt}
                        </p>
                    </div>

                    <MarkdownContent content={translation.content || translation.excerpt} />
                </article>
            </main>

            {related.length > 0 && (
                <section className="mx-auto max-w-5xl px-5 pb-12 sm:px-8">
                    <div className="mb-6 flex items-center gap-3">
                        <span
                            aria-hidden
                            className="h-6 w-1 rounded-full"
                            style={{ backgroundColor: "var(--blue)" }}
                        />
                        <h2
                            className="text-2xl font-bold"
                            style={{
                                color: "var(--blue)",
                                fontFamily: "var(--font-arabic-display)",
                            }}
                        >
                            {t("relatedTitle")}
                        </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {related.map((item) => (
                            <RelatedCard
                                key={item.id}
                                href={`/${locale}/courses/${categorySlug}/${item.id}`}
                                title={item.title}
                                excerpt={item.excerpt}
                                readMore={t("readMore")}
                                locale={locale}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section
                className="border-t"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--white)" }}
            >
                <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
                    <BackButton
                        href={`/${locale}/courses/${categorySlug}`}
                        label={t("backToList")}
                        locale={locale}
                    />
                </div>
            </section>
        </div>
    );
}
