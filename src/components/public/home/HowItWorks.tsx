import { IconBook2, IconBulb, IconCheck, IconRocket } from "@tabler/icons-react";

interface Props { t: any; locale?: string; }

export default function HowItWorks({ t }: Props) {
  const steps = [
    ["01", t("steps.exploreTitle"), t("steps.exploreDesc"), IconBulb],
    ["02", t("steps.learnTitle"), t("steps.learnDesc"), IconBook2],
    ["03", t("steps.practiceTitle"), t("steps.practiceDesc"), IconCheck],
    ["04", t("steps.growTitle"), t("steps.growDesc"), IconRocket],
  ] as const;

  return (
    <section className="relative overflow-hidden bg-blue-950 py-24 text-white sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute start-1/2 -top-40 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-300">{t("methodEyebrow")}</span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("methodTitle")}
          </h2>
          <p className="mt-5 text-base leading-8 text-blue-100/75">{t("methodDescription")}</p>
        </div>

        <div className="relative mt-20">
          <div aria-hidden="true" className="absolute inset-x-[12.5%] top-7 hidden h-px bg-white/15 md:block" />

          <div className="grid gap-14 md:grid-cols-4 md:gap-8">
            {steps.map(([n, title, desc, Icon]) => (
              <div key={n} className="relative text-center">
                <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/20 bg-blue-900 text-blue-200">
                  <Icon size={22} />
                </div>
                <span className="mt-6 block text-xs font-extrabold tracking-[.2em] text-blue-400">{n}</span>
                <h3 className="mt-2 font-display text-xl font-extrabold">{title}</h3>
                <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-7 text-blue-100/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}