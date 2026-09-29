import Link from "next/link";
import { IconArrowUpRight, IconBook2 } from "@tabler/icons-react";
import { CATEGORIES } from "@/types";
import CourseCard from "@/components/ui/CourseCard";
import CoursesCarousel from "./CoursesCarousel";

interface Props {
  locale: string;
  latestTitle: string;
  viewAll: string;
  emptyLabel: string;
  categoryLabels: Record<string, string>;
  publications: Array<{ id: number; category: string; title: string | null; excerpt: string | null }>;
}

const PREV: Record<string, string> = { ar: "السابق", en: "Previous", fr: "Précédent", ms: "Sebelumnya" };
const NEXT: Record<string, string> = { ar: "التالي", en: "Next", fr: "Suivant", ms: "Seterusnya" };
const SLIDE: Record<string, string> = { ar: "الشريحة", en: "Slide", fr: "Diapo", ms: "Slaid" };

export default function LatestCoursesSection({ locale, latestTitle, viewAll, emptyLabel, categoryLabels, publications }: Props) {
  const cards = publications.flatMap((pub) => {
    const cat = CATEGORIES.find((c) => c.key === pub.category);
    if (!cat) return [];
    return [
      <CourseCard
        key={pub.id}
        href={`/${locale}/courses/${cat.slug}/${pub.id}`}
        title={pub.title ?? "—"}
        excerpt={pub.excerpt ?? ""}
        categoryKey={pub.category}
        categoryLabel={categoryLabels[pub.category] ?? pub.category}
      />,
    ];
  });

  return (
    <section className="section-pad relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <div aria-hidden="true" className="pointer-events-none absolute start-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />

      <div className="section-shell relative">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-kicker"><IconBook2 size={14} />{latestTitle}</span>
            <h2 className="section-title">{latestTitle}</h2>
          </div>
          <Link
            href={`/${locale}/courses/courses`}
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-extrabold text-blue-700 transition hover:bg-blue-600 hover:text-white"
          >
            {viewAll}
            <IconArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="mt-8">
          {cards.length === 0 ? (
            <div className="empty-state">{emptyLabel}</div>
          ) : (
            <CoursesCarousel
              rtl={locale === "ar"}
              prevLabel={PREV[locale] ?? PREV.en}
              nextLabel={NEXT[locale] ?? NEXT.en}
              slideLabel={SLIDE[locale] ?? SLIDE.en}
            >
              {cards}
            </CoursesCarousel>
          )}
        </div>
      </div>
    </section>
  );
}