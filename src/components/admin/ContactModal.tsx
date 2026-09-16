"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    IconX,
    IconMail,
    IconMailOpened,
    IconTrash,
    IconLoader2,
} from "@tabler/icons-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    locale: string;
    read: boolean;
    createdAt: string;
};

type Props = {
    message: ModalContactMessage;
    locale: string;
    onClose: () => void;
    onDeleted: (id: number) => void;
    onReadToggled: (id: number, read: boolean) => void;
};

const LOCALE_LABELS: Record<string, string> = {
    ar: "العربية",
    en: "English",
    fr: "Français",
    ms: "Melayu",
};

const LOCALE_BCP47: Record<string, string> = {
    ar: "ar-TN",
    en: "en-GB",
    fr: "fr-FR",
    ms: "ms-MY",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactModal({ message: initialMessage, locale, onClose, onDeleted, onReadToggled }: Props) {
    const t = useTranslations("admin");
    const isRtl = locale === "ar";
    const bcp47 = LOCALE_BCP47[locale] ?? "en-GB";

    const [message, setMessage] = useState<ModalContactMessage>(initialMessage);
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    async function handleToggleRead() {
        setToggling(true);
        const newRead = !message.read;
        await fetch(`/api/contact/${message.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read: newRead }),
        });
        setMessage((prev) => ({ ...prev, read: newRead }));
        onReadToggled(message.id, newRead);
        setToggling(false);
    }

    async function handleDelete() {
        if (!confirm(t("confirm.deleteMessage"))) return;
        setDeleting(true);
        await fetch(`/api/contact/${message.id}`, { method: "DELETE" });
        onDeleted(message.id);
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                dir={isRtl ? "rtl" : "ltr"}
                className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
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
                        {t("contact.pageTitle")}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!message.read && (
                            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--blue)" }} />
                        )}
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                            style={{ color: "var(--blue-light)" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <IconX size={19} stroke={2} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-6 py-5">
                    <dl className="space-y-4 text-[0.9rem]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="text-sm mb-0.5" style={{ color: "#9ca3af" }}>{t("contact.name")}</dt>
                                <dd className="font-medium" style={{ color: "var(--black)", fontFamily: "var(--font-arabic-body)" }}>
                                    {message.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm mb-0.5" style={{ color: "#9ca3af" }}>{t("contact.language")}</dt>
                                <dd style={{ color: "var(--black)" }}>
                                    {LOCALE_LABELS[message.locale] ?? message.locale}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-sm mb-0.5" style={{ color: "#9ca3af" }}>{t("contact.email")}</dt>
                            <dd>
                                <a href={`mailto:${message.email}`} style={{ color: "var(--blue)" }} className="hover:underline">
                                    {message.email}
                                </a>
                            </dd>
                        </div>

                        {message.subject && (
                            <div>
                                <dt className="text-sm mb-0.5" style={{ color: "#9ca3af" }}>{t("contact.subject")}</dt>
                                <dd style={{ color: "var(--black)" }}>{message.subject}</dd>
                            </div>
                        )}

                        <div>
                            <dt className="text-sm mb-0.5" style={{ color: "#9ca3af" }}>{t("contact.date")}</dt>
                            <dd style={{ color: "var(--black)" }}>
                                {new Date(message.createdAt).toLocaleString(bcp47)}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm mb-1.5" style={{ color: "#9ca3af" }}>{t("contact.message")}</dt>
                            <dd
                                className="rounded-lg p-4 leading-relaxed whitespace-pre-wrap text-[0.95rem]"
                                style={{
                                    color: "var(--black)",
                                    backgroundColor: "var(--cream)",
                                    border: "1px solid var(--border)",
                                    fontFamily: "var(--font-arabic-body)",
                                }}
                            >
                                {message.message}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Footer */}
                <div
                    className="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
                    style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--cream)" }}
                >
                    <button
                        onClick={handleToggleRead}
                        disabled={toggling}
                        className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: "var(--blue-pale)",
                            color: "var(--blue)",
                            border: "1px solid var(--blue-pale)",
                            opacity: toggling ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => { if (!toggling) e.currentTarget.style.borderColor = "var(--blue)"; }}
                        onMouseLeave={(e) => { if (!toggling) e.currentTarget.style.borderColor = "var(--blue-pale)"; }}
                    >
                        {toggling
                            ? <IconLoader2 size={16} stroke={2} className="animate-spin" />
                            : message.read ? <IconMail size={16} stroke={2} /> : <IconMailOpened size={16} stroke={2} />
                        }
                        <span>{message.read ? t("actions.markUnread") : t("actions.markRead")}</span>
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center justify-center w-10 h-10 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            opacity: deleting ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.borderColor = "#dc2626"; }}
                        onMouseLeave={(e) => { if (!deleting) e.currentTarget.style.borderColor = "#fecaca"; }}
                    >
                        {deleting
                            ? <IconLoader2 size={16} stroke={2} className="animate-spin" />
                            : <IconTrash size={16} stroke={2} />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
