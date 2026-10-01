import Link from "next/link";
import { IconArrowUpRight, IconBook2, IconPlayerPlayFilled, IconSparkles } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import TopologyField from "./TopologyField";

interface Props { t: any; locale: string; }

export default function HeroSection({ t, locale }: Props) {
  const steps = [
    { n: "01", title: t("steps.exploreTitle"), desc: t("steps.exploreDesc"), pos: "top-[8%] -start-[2%]", delay: "0s" },
    { n: "02", title: t("steps.learnTitle"), desc: t("steps.learnDesc"), pos: "top-[24%] -end-[2%]", delay: "-1.5s" },
    { n: "03", title: t("steps.practiceTitle"), desc: t("steps.practiceDesc"), pos: "bottom-[22%] -start-[2%]", delay: "-3s" },
    { n: "04", title: t("steps.growTitle"), desc: t("steps.growDesc"), pos: "bottom-[8%] -end-[2%]", delay: "-4.5s" },
  ];

  return (
    <section className="relative flex min-h-[calc(100svh-72px)] flex-col justify-center overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:pt-24">
      <style>{`
        @keyframes hero-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-12px) } }
        @keyframes hero-spin { to { transform: rotate(360deg) } }
        @keyframes hero-spin-rev { to { transform: rotate(-360deg) } }
        .hero-float { animation: hero-float 6s ease-in-out infinite; }
        .hero-ring-a { animation: hero-spin 80s linear infinite; }
        .hero-ring-b { animation: hero-spin-rev 120s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-float, .hero-ring-a, .hero-ring-b { animation: none; }
        }
      `}</style>

      <div className="hero-orb hero-orb-one" aria-hidden="true" />
      <div className="hero-orb hero-orb-two" aria-hidden="true" />

      {/* dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:radial-gradient(#1d4ed81f_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-8">
        {/* text */}
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
            {[t("benefits.expert"), t("benefits.pace"), t("benefits.multilingual")].map((item) => (
              <span key={item} className="soft-pill">{item}</span>
            ))}
          </div>
        </div>

        {/* visual */}
        <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[480px] lg:max-w-[640px]">
          <div className="relative aspect-square w-full">
            {/* glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,#3b82f633_0%,#3b82f60d_55%,transparent_72%)] blur-2xl"
            />
            {/* rings */}
            <div aria-hidden="true" className="hero-ring-a pointer-events-none absolute inset-[2%] rounded-full border border-dashed border-blue-600/25" />
            <div aria-hidden="true" className="hero-ring-b pointer-events-none absolute inset-[12%] rounded-full border border-blue-600/15" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-6%] rounded-full border border-blue-600/10" />

            {/* sphere (interactive: drag to rotate) */}
            <div className="absolute inset-0">
              <TopologyField color="#1d4ed8" className="absolute inset-0 h-full w-full" />
            </div>

            {/* top badge */}
            <div className="hero-float absolute start-1/2 top-0 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-extrabold text-slate-800 shadow-lg shadow-blue-900/10 backdrop-blur-md md:inline-flex">
              <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_0_4px_#2563eb22]" />
              {t("badgeTitle")}
            </div>

            {/* step cards (md+) */}
            {steps.map((s) => (
              <div
                key={s.n}
                style={{ animationDelay: s.delay }}
                className={`hero-float absolute ${s.pos} hidden w-[210px] items-center gap-3 rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-xl shadow-blue-900/10 backdrop-blur-md md:flex`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs font-extrabold text-white">{s.n}</span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold text-slate-900">{s.title}</h3>
                  <p className="line-clamp-2 text-xs leading-4 text-slate-500">{s.desc}</p>
                </div>
              </div>
            ))}

            {/* bottom badge */}
            <div className="hero-float absolute bottom-0 start-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-blue-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-blue-900/25 md:inline-flex">
              {t("badgeText")}
              <IconArrowUpRight size={16} />
            </div>
          </div>

          {/* step cards (mobile) */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
            {steps.map((s) => (
              <div key={s.n} className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-md shadow-blue-900/5 backdrop-blur-md">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-[11px] font-extrabold text-white">{s.n}</span>
                <h3 className="truncate text-xs font-extrabold text-slate-900">{s.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}