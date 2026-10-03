import Link from "next/link";
import LogoWide from "@/assets/wide-logo.svg";
import LogoCircle from "@/assets/circle-logo.svg";
import { getLocale, getTranslations } from "next-intl/server";
import { IconArrowUpRight } from "@tabler/icons-react";

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");

  const links = [
    { href: `/${locale}`, label: t("links.home") },
    { href: `/${locale}/courses/courses`, label: t("links.publications") },
    { href: `/${locale}/about`, label: t("links.about") },
    { href: `/${locale}/platform`, label: t("links.platform") },
    { href: `/${locale}/contact`, label: t("links.contact") },
  ];

  const socials = [
    { href: "https://www.facebook.com", label: "Facebook" },
    { href: "https://www.instagram.com", label: "Instagram" },
    { href: "https://www.youtube.com", label: "YouTube" },
    { href: "https://www.linkedin.com", label: "LinkedIn" },
    { href: "https://www.tiktok.com", label: "TikTok" },
    { href: "https://www.x.com", label: "X (Twitter)" },
  ];

  const linkCls =
    "group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#c7d7ee] transition duration-200 hover:translate-x-0.5 hover:text-white rtl:hover:-translate-x-0.5";
  const arrowCls =
    "text-[#7fa3d6] transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-light rtl:group-hover:-translate-x-0.5";

  return (
    <footer className="relative overflow-hidden bg-blue-dark text-white">
      {/* top hairline */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-light/40 to-transparent" />

      <div className="section-shell relative">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_.8fr] lg:py-16">
          {/* brand */}
          <div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center rounded-2xl bg-white p-3 shadow-[0_18px_40px_rgba(4,20,45,.35)] transition hover:-translate-y-0.5"
            >
              <LogoWide className="block h-auto w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-8 text-[#c3d4ec]">{t("tagline")}</p>
          </div>

          {/* navigation */}
          <nav aria-label={t("links.navLabel")}>
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-blue-light">{t("links.navLabel")}</p>
            <div className="mt-4 grid gap-2.5">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                  <IconArrowUpRight size={14} className={arrowCls} />
                </Link>
              ))}
            </div>
          </nav>

          {/* socials */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.14em] text-blue-light">{t("socialsTitle")}</p>
            <div className="mt-4 grid gap-2.5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  {s.label}
                  <IconArrowUpRight size={14} className={arrowCls} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-[#8fa8c9]">{t("copyright")}</div>
      </div>
    </footer>
  );
}