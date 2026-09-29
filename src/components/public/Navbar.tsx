"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import {
  IconBook2,
  IconChevronDown,
  IconDeviceLaptop,
  IconGlobe,
  IconHome2,
  IconInfoCircle,
  IconLanguage,
  IconMail,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import LogoWide from "@/assets/wide-logo.svg";
import LogoCircle from "@/assets/circle-logo.svg";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "ms", label: "Melayu" },
] as const;

const LINKS = [
  { key: "home", href: "", Icon: IconHome2 },
  { key: "publications", href: "/courses/courses", Icon: IconBook2 },
  { key: "about", href: "/about", Icon: IconInfoCircle },
  { key: "platform", href: "/platform", Icon: IconDeviceLaptop },
  { key: "books", href: "/resources", Icon: IconBook2 },
  { key: "contact", href: "/contact", Icon: IconMail },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setLanguageOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const active = (href: string) => {
    const target = `/${locale}${href}`;
    return href === "" ? pathname === target : pathname === target || pathname.startsWith(`${target}/`);
  };

  const switchLocale = (nextLocale: string) => {
    setLanguageOpen(false);
    setOpen(false);
    if (nextLocale === locale) return;
    const prefix = new RegExp(`^/${locale}(?=/|$)`);
    const nextPath = prefix.test(pathname) ? pathname.replace(prefix, `/${nextLocale}`) : `/${nextLocale}${pathname}`;
    startTransition(() => router.push(nextPath));
  };

  return (
    <header className="sticky top-0 z-50 px-3 p-3 sm:px-5 lg:px-6">
      <nav className="mx-auto max-w-7xl rounded-2xl border border-slate-200/80 bg-white/90 shadow-[0_14px_45px_rgba(15,52,96,.10)] backdrop-blur-xl">
        <div className="flex h-[68px] items-center justify-between gap-4 px-3 sm:px-5">
          <Link href={`/${locale}`} aria-label="Intellecta" onClick={() => setOpen(false)} className="shrink-0">
            <LogoWide className="block h-auto  sm:h-8 sm:w-auto" aria-hidden="true" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map(({ key, href }) => (
              <Link key={key} href={`/${locale}${href}`} className={`nav-link ${active(href) ? "nav-link-active" : ""}`}>
                {t(key)}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <button type="button" onClick={() => setLanguageOpen((v) => !v)} className="nav-language" aria-expanded={languageOpen}>
                <IconGlobe size={17} />
                <span>{locale.toUpperCase()}</span>
                <IconChevronDown size={14} className={`transition-transform ${languageOpen ? "rotate-180" : ""}`} />
              </button>
              {languageOpen && (
                <div className="absolute end-0 top-[calc(100%+10px)] w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
                  {LOCALES.map((item) => (
                    <button key={item.code} onClick={() => switchLocale(item.code)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm ${item.code === locale ? "bg-blue-50 font-bold text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                      <span>{item.label}</span><span className="text-[11px] font-bold uppercase text-slate-400">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Link href={`/${locale}/courses/courses`} className="nav-cta">{t("publications")}</Link>
          </div>

          <button type="button" className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <IconX className="cursor-pointer" size={22} /> : <IconMenu2 className="cursor-pointer" size={22} />}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-100 px-3 pb-3 md:hidden">
            <div className="space-y-1 pt-3">
              {LINKS.map(({ key, href, Icon }) => (
                <Link key={key} href={`/${locale}${href}`} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold ${active(href) ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700"}`}>
                  <Icon size={18} />{t(key)}
                </Link>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-slate-50 p-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400"><IconLanguage size={15} />{t("language")}</div>
              <div className="grid grid-cols-2 gap-1">
                {LOCALES.map((item) => (
                  <button key={item.code} onClick={() => switchLocale(item.code)} className={`rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer ${item.code === locale ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>{item.label}</button>
                ))}
              </div>
            </div>
            {pending && <p className="px-3 pt-2 text-xs font-semibold text-blue-600">Loading…</p>}
          </div>
        )}
      </nav>
    </header>
  );
}
