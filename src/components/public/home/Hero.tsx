import Link from "next/link";
import LogoCircle from "@/assets/circle-logo.svg";
import { IconArrowUpRight, IconBook2, IconChevronRight, IconPlayerPlayFilled, IconSparkles } from "@tabler/icons-react";
import Button from "@/components/ui/Button";

interface Props { t: any; locale: string; }

export default function HeroSection({ t, locale }: Props) {
  const rtl = locale === "ar";
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:pt-24">
      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
        <div className="relative z-10">
          <div className="eyebrow"><IconSparkles size={15} />{t("bismillah")}</div>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-.04em] text-slate-950 sm:text-6xl lg:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{t("description")}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={`/${locale}/courses/courses`} icon={<IconBook2 size={18} />}>{t("cta")}</Button>
            <Link href={`/${locale}/platform`} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-white hover:text-blue-700">
              <IconPlayerPlayFilled size={14} className="text-blue-600" />{t("platformCta")}
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {[t("benefits.expert"), t("benefits.pace"), t("benefits.multilingual")].map((item) => <span key={item} className="soft-pill">{item}</span>)}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="hero-board">
            <div className="absolute inset-0 hero-dots" aria-hidden="true" />
            <div className="relative p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-100">Intellecta</span>
                  <h2 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">{t("spaceTitle")}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-blue-100/80">{t("subtitle")}</p>
                </div>
                <div className="hero-logo"><LogoCircle className="h-12 w-12" aria-hidden="true" /></div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  ["01", t("steps.exploreTitle"), t("steps.exploreDesc")],
                  ["02", t("steps.learnTitle"), t("steps.learnDesc")],
                  ["03", t("steps.practiceTitle"), t("steps.practiceDesc")],
                  ["04", t("steps.growTitle"), t("steps.growDesc")],
                ].map(([n, title, desc]) => (
                  <div key={n} className="hero-step">
                    <span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><IconChevronRight size={16} className={rtl ? "rotate-180" : ""} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hero-floating-card hero-floating-card-top"><span className="hero-floating-dot" />{t("badgeTitle")}</div>
          <div className="hero-floating-card hero-floating-card-bottom"><strong>{t("badgeText")}</strong><IconArrowUpRight size={17} /></div>
        </div>
      </div>
    </section>
  );
}
