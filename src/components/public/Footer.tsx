import Link from "next/link";
import LogoWide from "@/assets/wide-logo.svg";
import LogoCircle from "@/assets/circle-logo.svg";
import { getLocale, getTranslations } from "next-intl/server";
import { IconArrowUpRight } from "@tabler/icons-react";

export default async function Footer() {
    const locale = await getLocale(); const t = await getTranslations("footer");
    const links = [{ href: `/${locale}`, label: t("links.home") }, { href: `/${locale}/courses/courses`, label: t("links.publications") }, { href: `/${locale}/about`, label: t("links.about") }, { href: `/${locale}/platform`, label: t("links.platform") }, { href: `/${locale}/contact`, label: t("links.contact") }];
    const socials = [{ href: "https://www.facebook.com", label: "Facebook" }, { href: "https://www.instagram.com", label: "Instagram" }, { href: "https://www.youtube.com", label: "YouTube" }];
    return <footer className="footer"><div className="section-shell"><div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr] lg:py-14">
        <div><Link href={`/${locale}`} className="inline-flex items-center rounded-2xl bg-white p-3 shadow-lg"><LogoWide className="hidden h-auto w-auto sm:block" /><LogoCircle className="h-10 w-10 sm:hidden" /></Link><p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">{t("tagline")}</p></div>
        <nav aria-label={t("links.navLabel")}><p className="footer-label">{t("links.navLabel")}</p><div className="mt-4 grid gap-2">{links.map(l => <Link key={l.href} href={l.href} className="footer-link">{l.label}<IconArrowUpRight size={14} /></Link>)}</div></nav>
        <div><p className="footer-label">{t("socialsTitle")}</p><div className="mt-4 grid gap-2">{socials.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-link">{s.label}<IconArrowUpRight size={14} /></a>)}</div></div>
    </div><div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">{t("copyright")}</div></div></footer>
}
