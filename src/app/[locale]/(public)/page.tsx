import { getTranslations, getLocale } from "next-intl/server";
import { getLatestCourseByCategory } from "@/lib/courses";
import HeroSection from "@/components/public/home/Hero";
import FeaturesSection from "@/components/public/home/Features";
import LatestCoursesSection from "@/components/public/home/LatestCourses";
import ContactSection from "@/components/public/home/ContactSection";
import HowItWorks from "@/components/public/home/HowItWorks";
import PlatformCta from "@/components/public/home/PlatformCta";
import { CATEGORIES } from "@/types";

async function fetchLatestCourses(locale: string) {
    const categories = ["courses", "programming", "mathematics", "sciences", "business", "languages"] as const;
    const results = await Promise.allSettled(
        categories.map((cat) => getLatestCourseByCategory(cat, locale))
    );
    return results
        .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
        .sort((a, b) => {
            const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return bTime - aTime;
        })
        .slice(0, 3);
}

const VIEW_ALL: Record<string, string> = {
    ar: "عرض الكل",
    en: "View all",
    fr: "Voir tout",
    ms: "Lihat semua",
};

const EMPTY_LABEL: Record<string, string> = {
    ar: "لا توجد دورات مميزة حالياً.",
    en: "No featured courses yet.",
    fr: "Aucun cours récent.",
    ms: "Tiada kursus pilihan terkini.",
};

export default async function HomePage() {
    const t = await getTranslations("home");
    const tNav = await getTranslations("nav");
    const tContact = await getTranslations("contact");
    const locale = await getLocale();

    const latest = await fetchLatestCourses(locale);

    const categoryLabels = Object.fromEntries(
        CATEGORIES.map((c) => [c.key, tNav(`categories.${c.key}`)])
    );

    return (
        <main dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-screen flex-col bg-cream">
            <HeroSection locale={locale} t={t} />
            <FeaturesSection locale={locale} t={t} />
            <HowItWorks locale={locale} t={t} />
            <LatestCoursesSection
                locale={locale}
                latestTitle={t("latestTitle")}
                viewAll={VIEW_ALL[locale] ?? VIEW_ALL.en}
                emptyLabel={EMPTY_LABEL[locale] ?? EMPTY_LABEL.en}
                categoryLabels={categoryLabels}
                publications={latest}
            />
            <PlatformCta locale={locale} t={t} />
            <ContactSection
                locale={locale}
                title={tContact("title")}
                subtitle={tContact("subtitle")}
                note={tContact("note")}
                email={tContact("email")}
                location={tContact("location")}
                sessions={tContact("sessions")}
                contactLabel={tNav("contact")}
            />
        </main>
    );
}