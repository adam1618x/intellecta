"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { IconEye, IconLoader2, IconPencil, IconX } from "@tabler/icons-react";
import MarkdownContent from "@/components/content/MarkdownContent";

// ── Types ─────────────────────────────────────────────────────────────────────

const LOCALES = ["ar", "en", "fr", "ms"] as const;
type Locale = (typeof LOCALES)[number];

type Translation = {
    locale: Locale;
    title: string;
    excerpt: string;
    content: string;
};

export type ModalPublication = {
    id: number;
    author: string | null;
    publishedAt: string;
    translations: Array<{
        locale: string;
        title: string;
        excerpt: string;
        content: string;
    }>;
};

type Props = {
    mode: "add" | "edit";
    category: string;
    publication?: ModalPublication;
    onClose: () => void;
    onSaved: () => void;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function emptyTranslations(): Translation[] {
    return LOCALES.map((locale) => ({ locale, title: "", excerpt: "", content: "" }));
}

function toDateInput(iso: string): string {
    return iso ? iso.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CourseModal({ mode, category, publication, onClose, onSaved }: Props) {
    const t = useTranslations("admin.modal");
    const isEdit = mode === "edit";
    const titleId = useId();

    const [author, setAuthor] = useState(publication?.author ?? "");
    const [publishedAt, setPublishedAt] = useState(
        publication ? toDateInput(publication.publishedAt) : new Date().toISOString().slice(0, 10)
    );
    const [translations, setTranslations] = useState<Translation[]>(() => {
        if (!publication) return emptyTranslations();
        return LOCALES.map((locale) => {
            const existing = publication.translations.find((t) => t.locale === locale);
            return {
                locale,
                title: existing?.title ?? "",
                excerpt: existing?.excerpt ?? "",
                content: existing?.content ?? "",
            };
        });
    });

    const [activeLocale, setActiveLocale] = useState<Locale>("ar");
    const [contentMode, setContentMode] = useState<"write" | "preview">("write");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    function updateTranslation(locale: Locale, field: keyof Omit<Translation, "locale">, value: string) {
        setTranslations((prev) =>
            prev.map((tr) => (tr.locale === locale ? { ...tr, [field]: value } : tr))
        );
    }

    const activeTranslation = translations.find((tr) => tr.locale === activeLocale)!;

    async function handleSubmit() {
        setError(null);

        const filledTranslations = translations.filter(
            (tr) => tr.title.trim() || tr.excerpt.trim() || tr.content.trim()
        );
        if (filledTranslations.length === 0) {
            setError(t("errors.noTranslations"));
            return;
        }
        for (const tr of filledTranslations) {
            if (!tr.title.trim() || !tr.excerpt.trim() || !tr.content.trim()) {
                setError(t("errors.incompleteTranslation").replace("{locale}", t(`locales.${tr.locale}`)));
                return;
            }
        }

        setSaving(true);
        try {
            const url = isEdit
                ? `/api/courses/${category}/${publication!.id}`
                : `/api/courses/${category}`;

            const res = await fetch(url, {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: author.trim() || null,
                    publishedAt: new Date(publishedAt).toISOString(),
                    translations: filledTranslations,
                }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                setError(json.error ?? t("errors.saveFailed"));
                return;
            }

            onSaved();
            onClose();
        } catch {
            setError(t("errors.networkError"));
        } finally {
            setSaving(false);
        }
    }

    const inputBase: React.CSSProperties = {
        fontFamily: "var(--font-arabic-body)",
        backgroundColor: "var(--cream)",
        border: "1px solid var(--border)",
        color: "var(--black)",
    };

    const focusHandlers = {
        onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.target.style.borderColor = "var(--blue)";
            e.target.style.boxShadow = "0 0 0 3px var(--blue-pale)";
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
        },
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)" }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{ backgroundColor: "var(--blue)", borderBottom: "3px solid var(--blue)" }}
                >
                    <h2
                        id={titleId}
                        className="text-xl font-bold"
                        style={{ fontFamily: "var(--font-arabic-display)", color: "var(--white)" }}
                    >
                        {isEdit ? t("editTitle") : t("addTitle")}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("cancel")}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                        style={{ color: "var(--blue-light)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <IconX size={19} stroke={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
                    {/* Author / Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                                {t("fields.author")}
                            </label>
                            <input
                                type="text"
                                placeholder={t("fields.authorPlaceholder")}
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition"
                                style={inputBase}
                                {...focusHandlers}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                                {t("fields.date")}
                            </label>
                            <input
                                type="date"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition"
                                style={inputBase}
                                {...focusHandlers}
                            />
                        </div>
                    </div>

                    {/* Locale tabs + translation fields */}
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                            {t("fields.translations")}
                        </label>
                        <div
                            className="flex items-center gap-1 p-1 rounded-lg mb-4 w-fit"
                            style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border)" }}
                        >
                            {LOCALES.map((loc) => {
                                const tr = translations.find((x) => x.locale === loc)!;
                                const filled = tr.title.trim() && tr.excerpt.trim() && tr.content.trim();
                                return (
                                    <button
                                        type="button"
                                        key={loc}
                                        onClick={() => setActiveLocale(loc)}
                                        className="relative px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer"
                                        style={{
                                            backgroundColor: activeLocale === loc ? "var(--blue)" : "transparent",
                                            color: activeLocale === loc ? "var(--white)" : "var(--blue)",
                                        }}
                                    >
                                        {t(`locales.${loc}`)}
                                        {filled && (
                                            <span
                                                className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: activeLocale === loc ? "var(--blue-light)" : "var(--blue)" }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                                    {t("fields.fieldTitle")}
                                </label>
                                <input
                                    type="text"
                                    placeholder={t("fields.titlePlaceholder")}
                                    value={activeTranslation.title}
                                    onChange={(e) => updateTranslation(activeLocale, "title", e.target.value)}
                                    dir={activeLocale === "ar" ? "rtl" : "ltr"}
                                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition"
                                    style={inputBase}
                                    {...focusHandlers}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                                    {t("fields.excerpt")}
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder={t("fields.excerptPlaceholder")}
                                    value={activeTranslation.excerpt}
                                    onChange={(e) => updateTranslation(activeLocale, "excerpt", e.target.value)}
                                    dir={activeLocale === "ar" ? "rtl" : "ltr"}
                                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition resize-none"
                                    style={inputBase}
                                    {...focusHandlers}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}>
                                    {t("fields.content")}
                                    <span
                                        className="ms-2 inline-flex rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide"
                                        style={{
                                            color: "var(--blue-dark)",
                                            backgroundColor: "var(--blue-pale)",
                                        }}
                                    >
                                        Markdown
                                    </span>
                                </label>
                                <div
                                    className="mb-2 flex items-center justify-between gap-3 rounded-lg p-1"
                                    style={{
                                        backgroundColor: "var(--cream)",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setContentMode("write")}
                                            aria-pressed={contentMode === "write"}
                                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                                            style={{
                                                backgroundColor: contentMode === "write" ? "var(--blue)" : "transparent",
                                                color: contentMode === "write" ? "var(--white)" : "var(--blue)",
                                            }}
                                        >
                                            <IconPencil size={14} aria-hidden />
                                            {t("markdown.write")}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setContentMode("preview")}
                                            aria-pressed={contentMode === "preview"}
                                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
                                            style={{
                                                backgroundColor: contentMode === "preview" ? "var(--blue)" : "transparent",
                                                color: contentMode === "preview" ? "var(--white)" : "var(--blue)",
                                            }}
                                        >
                                            <IconEye size={14} aria-hidden />
                                            {t("markdown.preview")}
                                        </button>
                                    </div>
                                </div>

                                {contentMode === "write" ? (
                                    <>
                                        <textarea
                                            rows={10}
                                            placeholder={t("fields.contentPlaceholder")}
                                            value={activeTranslation.content}
                                            onChange={(e) => updateTranslation(activeLocale, "content", e.target.value)}
                                            dir={activeLocale === "ar" ? "rtl" : "ltr"}
                                            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition resize-y"
                                            style={inputBase}
                                            {...focusHandlers}
                                        />
                                        <p
                                            className="mt-1.5 text-xs"
                                            style={{ color: "#6b7280" }}
                                        >
                                            {t("markdown.help")}
                                        </p>
                                    </>
                                ) : (
                                    <div
                                        dir={activeLocale === "ar" ? "rtl" : "ltr"}
                                        className="min-h-64 rounded-lg px-5 py-4"
                                        style={{
                                            backgroundColor: "var(--white)",
                                            border: "1px solid var(--border)",
                                        }}
                                    >
                                        {activeTranslation.content.trim() ? (
                                            <MarkdownContent content={activeTranslation.content} />
                                        ) : (
                                            <p className="text-sm" style={{ color: "#9ca3af" }}>
                                                {t("markdown.emptyPreview")}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
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
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
                    style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--cream)" }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                        style={{
                            backgroundColor: "var(--white)",
                            border: "1px solid var(--border)",
                            color: "#6b7280",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--blue)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                        {t("cancel")}
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: saving ? "var(--blue-light)" : "var(--blue)",
                            color: "var(--white)",
                            opacity: saving ? 0.75 : 1,
                            fontFamily: "var(--font-arabic-body)",
                        }}
                        onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "var(--blue-light)"; }}
                        onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "var(--blue)"; }}
                    >
                        {saving && <IconLoader2 size={16} stroke={2} className="animate-spin" />}
                        {saving ? t("saving") : isEdit ? t("saveEdit") : t("save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
