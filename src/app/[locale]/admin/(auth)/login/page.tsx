"use client";
import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconLanguage, IconCheck, IconChevronDown } from "@tabler/icons-react";
import ParticleNetwork from "@/components/auth/ParticleNetwork";

const LOCALES = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ms", label: "Melayu" },
] as const;

export default function AdminLoginPage() {
    const t = useTranslations("admin.login");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { locale } = useParams<{ locale: string }>();
    const callbackUrl = searchParams.get("callbackUrl") ?? `/${locale}/admin/dashboard`;

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [langOpen, setLangOpen] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function switchToLocale(next: string) {
        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(new RegExp(`^/${locale}`), `/${next}`);
        router.push(newPath);
        setLangOpen(false);
    }

    async function handleSubmit(e: FormEvent) {
        console.log("handleSubmit called");
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError(t("invalid"));
                return;
            }

            router.push(callbackUrl);
        } catch {
            setError(t("generic"));
        } finally {
            setLoading(false);
        }
    }

    const currentLocaleLabel = LOCALES.find((l) => l.code === locale)?.label ?? locale.toUpperCase();

    return (
        <div
            className="relative min-h-svh flex items-center justify-center px-4 pt-20 pb-8 sm:py-8"
            style={{ backgroundColor: "var(--cream)" }}
        >
            <ParticleNetwork cardSelector=".admin-auth-card" />
            {/* Decorative background pattern */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, var(--blue) 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Language switcher — top right corner */}
            <div className="absolute top-4 end-4 z-10" ref={langRef}>
                <button
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer shadow-sm"
                    style={{
                        backgroundColor: "var(--white)",
                        border: "1px solid var(--border)",
                        color: "var(--blue)",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--blue)"}
                    onMouseLeave={(e) => { if (!langOpen) e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                    <IconLanguage size={15} stroke={2} style={{ color: "var(--blue)" }} />
                    <span style={{ fontFamily: "var(--font-arabic-body)" }}>{currentLocaleLabel}</span>
                    <IconChevronDown
                        size={13}
                        stroke={2}
                        style={{
                            color: "var(--blue)",
                            transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                        }}
                    />
                </button>

                {langOpen && (
                    <div
                        className="absolute top-full end-0 mt-1.5 min-w-[140px] rounded-xl overflow-hidden shadow-lg z-50"
                        style={{
                            backgroundColor: "var(--white)",
                            border: "1px solid var(--border)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                    >
                        {LOCALES.map(({ code, label }) => (
                            <button
                                key={code}
                                onClick={() => switchToLocale(code)}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-sm transition-all cursor-pointer"
                                style={{
                                    color: code === locale ? "var(--blue)" : "#555",
                                    backgroundColor: code === locale ? "var(--blue-pale)" : "transparent",
                                    fontFamily: "var(--font-arabic-body)",
                                }}
                                onMouseEnter={(e) => { if (code !== locale) e.currentTarget.style.backgroundColor = "var(--cream)"; }}
                                onMouseLeave={(e) => { if (code !== locale) e.currentTarget.style.backgroundColor = "transparent"; }}
                            >
                                <span>{label}</span>
                                {code === locale && <IconCheck size={13} style={{ color: "var(--blue)" }} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full max-w-sm admin-auth-card">
                {/* Card */}
                <div
                    className="auth-card-glow rounded-2xl shadow-lg overflow-hidden"
                    style={{
                        backgroundColor: "var(--white)",
                        border: "1px solid var(--border)",
                    }}
                >
                    {/* Header band */}
                    <div
                        className="px-5 py-6 sm:px-8 sm:py-7 text-center"
                        style={{ backgroundColor: "var(--blue)" }}
                    >
                        <div className="flex justify-center">
                            <div className="flex items-center justify-center w-14 h-14 rounded-2xl border border-white/20 text-2xl font-bold text-white">I</div>
                        </div>

                        <h1
                            className="text-2xl sm:text-3xl font-bold leading-snug break-words"
                            style={{
                                fontFamily: "var(--font-arabic-display)",
                                color: "var(--white)",
                            }}
                        >
                            {t("title")}
                        </h1>

                        <div
                            className="mt-1 text-xl sm:text-2xl tracking-widest uppercase"
                            style={{ color: "var(--blue-light)", fontFamily: "var(--font-arabic-body)" }}
                        >
                            {t("panel")}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="px-5 py-6 sm:px-8 sm:py-7">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium mb-1.5"
                                    style={{
                                        fontFamily: "var(--font-arabic-body)",
                                        color: "var(--blue)",
                                    }}
                                >
                                    {t("username")}
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-2.5 rounded-lg text-base sm:text-sm transition outline-none"
                                    style={{
                                        fontFamily: "var(--font-arabic-body)",
                                        backgroundColor: "var(--cream)",
                                        border: "1px solid var(--border)",
                                        color: "var(--black)",
                                    }}
                                    placeholder="admin"
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--blue)";
                                        e.target.style.boxShadow = "0 0 0 3px var(--blue-pale)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--border)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium mb-1.5"
                                    style={{
                                        fontFamily: "var(--font-arabic-body)",
                                        color: "var(--blue)",
                                    }}
                                >
                                    {t("password")}
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 sm:py-2.5 rounded-lg text-base sm:text-sm transition outline-none"
                                    style={{
                                        fontFamily: "var(--font-arabic-body)",
                                        backgroundColor: "var(--cream)",
                                        border: "1px solid var(--border)",
                                        color: "var(--black)",
                                    }}
                                    placeholder="••••••••"
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "var(--blue)";
                                        e.target.style.boxShadow = "0 0 0 3px var(--blue-pale)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "var(--border)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-center px-4 py-2.5 rounded-lg"
                                    style={{
                                        fontFamily: "var(--font-arabic-body)",
                                        backgroundColor: "#fef2f2",
                                        border: "1px solid #fecaca",
                                        color: "#dc2626",
                                    }}
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 sm:py-2.5 px-4 rounded-lg font-medium text-base sm:text-sm transition-all"
                                style={{
                                    fontFamily: "var(--font-arabic-body)",
                                    backgroundColor: loading ? "var(--blue-light)" : "var(--blue)",
                                    color: "var(--white)",
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? "not-allowed" : "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) e.currentTarget.style.backgroundColor = "var(--blue-light)";
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) e.currentTarget.style.backgroundColor = "var(--blue)";
                                }}
                            >
                                {loading ? t("submitting") : t("submit")}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Subtle shadow glow */}

            </div>
        </div>
    );
}