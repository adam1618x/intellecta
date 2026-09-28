import Link from "next/link";
import { IconArrowUpRight, IconDeviceLaptop } from "@tabler/icons-react";

interface Props { t: any; locale: string; }

export default function PlatformCta({ t, locale }: Props) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-slate-50/60 p-8 text-center sm:p-10 lg:flex-row lg:text-start">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <IconDeviceLaptop size={26} />
          </div>

          <div className="min-w-0 flex-1">
            <span className="section-kicker">{t("resourceEyebrow")}</span>
            <h2 className="mt-2 font-display text-xl font-extrabold text-slate-950 sm:text-2xl">{t("resourceTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{t("resourceDescription")}</p>
          </div>

          <Link
            href={`/${locale}/resources`}
            className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {t("resourceCta")}
            <IconArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
          </Link>
        </div>
      </div>
    </section>
  );
}