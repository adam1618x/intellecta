import { getTranslations } from "next-intl/server";
import { IconBook2, IconLanguage, IconSparkles, IconTarget } from "@tabler/icons-react";
import LogoCircle from "@/assets/circle-logo.svg";
const FACTS = ["lineage", "order", "speciality", "location"] as const;
const ICONS = [IconSparkles, IconLanguage, IconBook2, IconTarget];
export default async function AboutPage() {
    const t = await getTranslations("about"); return <div>
        <header className="page-hero"><div className="page-hero-inner"><h1>{t("title")}</h1><p>{t("subtitle")}</p></div></header>
        <main className="section-shell section-pad"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><span className="section-kicker">{t("bioTitle")}</span><h2 className="section-title">{t("bioTitle")}</h2></div><p className="text-base leading-8 text-slate-600 sm:text-lg">{t("bio")}</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">{FACTS.map((key, i) => { const Icon = ICONS[i]; return <div key={key} className="info-card"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Icon size={20} /></div><p className="mt-5 text-xs font-extrabold uppercase tracking-wider text-blue-600">{t(`facts.${key}.label`)}</p><p className="mt-2 text-sm leading-7 text-slate-600">{t(`facts.${key}.value`)}</p></div> })}</div>
            <div className="mt-14 rounded-[2rem] border border-blue-100 bg-blue-50/70 p-6 sm:p-9"><span className="section-kicker">{t("pathTitle")}</span><p className="mt-4 max-w-4xl text-base leading-8 text-slate-700 sm:text-lg">{t("path")}</p></div></main></div>
}
