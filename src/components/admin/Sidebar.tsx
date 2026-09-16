"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
    IconLayoutGrid,
    IconBook2,
    IconBooks,
    IconMail,
    IconLogout,
    IconChevronLeft,
    IconCircleFilled,
    IconLanguage,
    IconCheck,
    IconMenu2,
    IconX,
} from "@tabler/icons-react";

const CATEGORY_KEYS = ["courses", "programming", "mathematics", "sciences", "business", "languages"] as const;

const LOCALES = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ms", label: "Melayu" },
] as const;

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("admin");

    const [pubsOpen, setPubsOpen] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    const locale = pathname.split("/")[1] ?? "ar";
    const isRtl = locale === "ar";

    function switchToLocale(next: string) {
        const newPath = pathname.replace(new RegExp(`^/${locale}`), `/${next}`);
        router.push(newPath);
        setLangOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    async function handleLogout() {
        setLoggingOut(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push(`/${locale}/admin/login`);
    }

    function isActive(href: string) {
        return pathname === href || pathname.startsWith(href + "/");
    }

    // RTL-aware slide: in RTL the sidebar is anchored to the right (end),
    // so "closed" means translated to the RIGHT (+X), not left (-X).
    const hiddenTranslate = isRtl ? "translate-x-full" : "-translate-x-full";
    const visibleTranslate = "translate-x-0";

    const sidebarContent = (
        <>
            {/* Logo */}
            <div
                className="px-6 py-7 text-center"
                style={{ borderBottom: "1px solid rgba(37,99,235,0.3)" }}
            >
                <h1
                    className="text-xl sm:text-2xl font-bold"
                    style={{ fontFamily: "var(--font-arabic-display)", color: "var(--white)" }}
                >
                    {t("site.title")}
                </h1>
                <p className="text-sm mt-1" style={{ color: "var(--blue-light)" }}>
                    {t("site.panel")}
                </p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
                <SidebarLink
                    href={`/${locale}/admin/dashboard`}
                    active={isActive(`/${locale}/admin/dashboard`)}
                    icon={<IconLayoutGrid size={19} stroke={2} />}
                    label={t("nav.dashboard")}
                />

                {/* Publications accordion */}
                <div>
                    <button
                        onClick={() => setPubsOpen(!pubsOpen)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[0.95rem] transition-all cursor-pointer"
                        style={{
                            color: "var(--blue-light)",
                            backgroundColor: pubsOpen ? "rgba(255,255,255,0.08)" : "transparent",
                        }}
                    >
                        <span className="flex items-center gap-2.5">
                            <IconBook2 size={19} stroke={2} style={{ color: "var(--blue)", opacity: 0.85 }} />
                            <span>{t("nav.publications")}</span>
                        </span>
                        <IconChevronLeft
                            size={17}
                            stroke={2}
                            className="transition-transform"
                            style={{
                                transform: `scaleX(${isRtl ? 1 : -1}) rotate(${pubsOpen ? -90 : 0}deg)`,
                            }}
                        />
                    </button>

                    {pubsOpen && (
                        <div className="mt-1 me-3 space-y-0.5">
                            {CATEGORY_KEYS.map((key) => (
                                <SidebarLink
                                    key={key}
                                    href={`/${locale}/admin/courses/${key}`}
                                    active={isActive(`/${locale}/admin/courses/${key}`)}
                                    icon={<IconCircleFilled size={7} />}
                                    label={t(`categories.${key}`)}
                                    small
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Books */}
                <SidebarLink
                    href={`/${locale}/admin/resources`}
                    active={isActive(`/${locale}/admin/resources`)}
                    icon={<IconBooks size={19} stroke={2} />}
                    label={t("nav.books")}
                />

                {/* Messages */}
                <SidebarLink
                    href={`/${locale}/admin/contact`}
                    active={isActive(`/${locale}/admin/contact`)}
                    icon={<IconMail size={19} stroke={2} />}
                    label={t("nav.messages")}
                />
            </nav>

            {/* Language switcher + Logout */}
            <div className="px-3 py-4 space-y-1.5" style={{ borderTop: "1px solid rgba(37,99,235,0.3)" }}>
                {/* Language */}
                <div className="relative" ref={langRef}>
                    <button
                        onClick={() => setLangOpen(!langOpen)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.95rem] transition-all cursor-pointer"
                        style={{ color: "var(--blue-light)", backgroundColor: langOpen ? "rgba(255,255,255,0.08)" : "transparent" }}
                        onMouseEnter={(e) => { if (!langOpen) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={(e) => { if (!langOpen) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                        <IconLanguage size={19} stroke={2} style={{ color: "var(--blue)", opacity: 0.85 }} />
                        <span className="flex-1 text-start">{LOCALES.find((l) => l.code === locale)?.label ?? locale.toUpperCase()}</span>
                        <IconChevronLeft
                            size={15}
                            stroke={2}
                            className="transition-transform"
                            style={{
                                transform: `scaleX(${isRtl ? 1 : -1}) rotate(${langOpen ? -90 : 0}deg)`,
                                opacity: 0.6,
                            }}
                        />
                    </button>

                    {langOpen && (
                        <div
                            className="absolute bottom-full left-0 right-0 mb-1.5 rounded-xl overflow-hidden z-50"
                            style={{
                                background: "rgba(16, 55, 35, 0.98)",
                                border: "1px solid rgba(37,99,235,0.3)",
                                boxShadow: "0 -12px 32px rgba(0,0,0,0.35)",
                            }}
                        >
                            {LOCALES.map(({ code, label }) => (
                                <button
                                    key={code}
                                    onClick={() => switchToLocale(code)}
                                    className="flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all cursor-pointer"
                                    style={{
                                        color: code === locale ? "var(--white)" : "rgba(255,255,255,0.55)",
                                        backgroundColor: code === locale ? "rgba(37,99,235,0.12)" : "transparent",
                                    }}
                                    onMouseEnter={(e) => { if (code !== locale) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)"; }}
                                    onMouseLeave={(e) => { if (code !== locale) e.currentTarget.style.backgroundColor = "transparent"; }}
                                >
                                    <span>{label}</span>
                                    {code === locale && <IconCheck size={13} style={{ color: "var(--blue)" }} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.95rem] transition-all cursor-pointer"
                    style={{ color: "var(--blue-light)", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                    <IconLogout size={19} stroke={2} />
                    <span>{loggingOut ? t("logout.loading") : t("logout.label")}</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile toggle button — anchored to the correct side for RTL/LTR */}
            <button
                className="md:hidden fixed top-3 z-50 p-2 rounded-lg shadow-lg"
                style={{
                    background: "var(--blue)",
                    color: "var(--blue)",
                    border: "1px solid rgba(37,99,235,0.3)",
                    // Use inline style for logical positioning so it works in both directions
                    insetInlineStart: "0.75rem",
                }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/50"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar — slides in from the inline-start edge in both LTR and RTL */}
            <aside
                className={`
                    fixed md:static top-0 bottom-0 z-40
                    w-64 min-h-screen flex flex-col shadow-lg
                    transition-transform duration-300
                    ${mobileOpen ? visibleTranslate : hiddenTranslate} md:translate-x-0
                `}
                style={{
                    backgroundColor: "var(--blue)",
                    borderInlineEnd: "3px solid var(--blue)",
                    // Anchor to the inline-start edge so it works for both RTL and LTR
                    insetInlineStart: 0,
                }}
                dir={isRtl ? "rtl" : "ltr"}
            >
                {sidebarContent}
            </aside>
        </>
    );
}

function SidebarLink({
    href,
    active,
    icon,
    label,
    small = false,
}: {
    href: string;
    active: boolean;
    icon: React.ReactNode;
    label: string;
    small?: boolean;
}) {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push(href)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-start cursor-pointer"
            style={{
                color: active ? "var(--blue)" : "var(--blue-light)",
                backgroundColor: active ? "rgba(37,99,235,0.15)" : "transparent",
                fontSize: small ? "0.875rem" : "0.95rem",
                borderInlineStart: active ? "2px solid var(--blue)" : "2px solid transparent",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
        >
            <span className="flex items-center justify-center shrink-0" style={{ color: "var(--blue)", opacity: 0.8 }}>
                {icon}
            </span>
            <span>{label}</span>
        </button>
    );
}