"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IconX, IconLoader2 } from "@tabler/icons-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalBook = {
    id: number;
    title: string;
    author: string | null;
    description: string | null;
    year: string | null;
    pages: string | null;
    downloadUrl: string | null;
};

type Props = {
    mode: "add" | "edit";
    book?: ModalBook;
    onClose: () => void;
    onSaved: () => void;
};

// ── Shared styles (defined once, outside component, never cause remounts) ─────

const inputBase: React.CSSProperties = {
    fontFamily: "var(--font-arabic-body)",
    backgroundColor: "var(--cream)",
    border: "1px solid var(--border)",
    color: "var(--black)",
    width: "100%",
    outline: "none",
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "var(--blue)";
    e.target.style.boxShadow = "0 0 0 3px var(--blue-pale)";
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
}

// ── Field wrapper — defined OUTSIDE so it never remounts on parent re-render ──

function Field({
    label,
    required,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--blue)", fontFamily: "var(--font-arabic-body)" }}
            >
                {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
            </label>
            {children}
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BookModal({ mode, book, onClose, onSaved }: Props) {
    const t = useTranslations("admin");
    const isEdit = mode === "edit";

    const [title, setTitle] = useState(book?.title ?? "");
    const [author, setAuthor] = useState(book?.author ?? "");
    const [description, setDescription] = useState(book?.description ?? "");
    const [year, setYear] = useState(book?.year ?? "");
    const [pages, setPages] = useState(book?.pages ?? "");
    const [downloadUrl, setDownloadUrl] = useState(book?.downloadUrl ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    async function handleSubmit() {
        setError(null);
        if (!title.trim()) {
            setError(t("books.modal.errors.titleRequired"));
            return;
        }
        setSaving(true);
        try {
            const url = isEdit ? `/api/resources/${book!.id}` : "/api/resources";
            const res = await fetch(url, {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    author: author.trim() || null,
                    description: description.trim() || null,
                    year: year.trim() || null,
                    pages: pages.trim() || null,
                    downloadUrl: downloadUrl.trim() || null,
                }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                setError((json as { error?: string }).error ?? t("books.modal.errors.saveFailed"));
                return;
            }
            onSaved();
            onClose();
        } catch {
            setError(t("books.modal.errors.networkError"));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)" }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{ backgroundColor: "var(--blue)", borderBottom: "3px solid var(--blue)" }}
                >
                    <h2
                        className="text-xl font-bold"
                        style={{ fontFamily: "var(--font-arabic-display)", color: "var(--white)" }}
                    >
                        {isEdit ? t("books.modal.editTitle") : t("books.modal.addTitle")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer"
                        style={{ color: "var(--blue-light)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <IconX size={19} stroke={2} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

                    <Field label={t("books.modal.fields.title")} required>
                        <input
                            type="text"
                            placeholder={t("books.modal.fields.titlePlaceholder")}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="px-4 py-2.5 rounded-lg text-sm transition"
                            style={inputBase}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </Field>

                    <Field label={t("books.modal.fields.author")}>
                        <input
                            type="text"
                            placeholder={t("books.modal.fields.authorPlaceholder")}
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="px-4 py-2.5 rounded-lg text-sm transition"
                            style={inputBase}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label={t("books.modal.fields.year")}>
                            <input
                                type="text"
                                placeholder={t("books.modal.fields.yearPlaceholder")}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="px-4 py-2.5 rounded-lg text-sm transition"
                                style={inputBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </Field>
                        <Field label={t("books.modal.fields.pages")}>
                            <input
                                type="text"
                                placeholder={t("books.modal.fields.pagesPlaceholder")}
                                value={pages}
                                onChange={(e) => setPages(e.target.value)}
                                className="px-4 py-2.5 rounded-lg text-sm transition"
                                style={inputBase}
                                onFocus={onFocus}
                                onBlur={onBlur}
                            />
                        </Field>
                    </div>

                    <Field label={t("books.modal.fields.downloadUrl")}>
                        <input
                            type="url"
                            placeholder="https://..."
                            value={downloadUrl}
                            onChange={(e) => setDownloadUrl(e.target.value)}
                            dir="ltr"
                            className="px-4 py-2.5 rounded-lg text-sm transition"
                            style={inputBase}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </Field>

                    <Field label={t("books.modal.fields.description")}>
                        <textarea
                            rows={4}
                            placeholder={t("books.modal.fields.descriptionPlaceholder")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="px-4 py-2.5 rounded-lg text-sm transition resize-none"
                            style={inputBase}
                            onFocus={onFocus}
                            onBlur={onBlur}
                        />
                    </Field>

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
                        {t("modal.cancel")}
                    </button>
                    <button
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
                        {saving ? t("modal.saving") : isEdit ? t("modal.saveEdit") : t("modal.save")}
                    </button>
                </div>
            </div>
        </div>
    );
}