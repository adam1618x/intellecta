"use client";

import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
    open: boolean;
    locale: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    locale,
    message,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const t = useTranslations("admin");
    const isRtl = locale === "ar";
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Auto-focus Cancel on open (safer default)
    useEffect(() => {
        if (open) {
            setTimeout(() => cancelRef.current?.focus(), 50);
        }
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onCancel();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    // Per-locale fallback labels in case translation keys aren't wired yet
    const fallbackMessage: Record<string, string> = {
        ar: "هل أنت متأكد من المتابعة؟",
        fr: "Êtes-vous sûr de vouloir continuer ?",
        ms: "Adakah anda pasti untuk meneruskan?",
        en: "Are you sure you want to proceed?",
    };
    const fallbackConfirm: Record<string, string> = {
        ar: "تأكيد",
        fr: "Confirmer",
        ms: "Sahkan",
        en: "Confirm",
    };
    const fallbackCancel: Record<string, string> = {
        ar: "إلغاء",
        fr: "Annuler",
        ms: "Batal",
        en: "Cancel",
    };

    let labelConfirm: string;
    let labelCancel: string;
    let labelMessage: string;

    try { labelConfirm = t("confirm.action"); } catch { labelConfirm = fallbackConfirm[locale] ?? fallbackConfirm.en; }
    try { labelCancel = t("confirm.cancel"); } catch { labelCancel = fallbackCancel[locale] ?? fallbackCancel.en; }
    labelMessage = message ?? (fallbackMessage[locale] ?? fallbackMessage.en);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={onCancel}
        >
            <div
                dir={isRtl ? "rtl" : "ltr"}
                className="relative w-full max-w-sm rounded-2xl shadow-xl p-6"
                style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", fontFamily: "var(--font-arabic-body)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Red X badge */}
                <div className="flex items-center justify-center mb-5">
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-xl"
                        style={{ backgroundColor: "#fef2f2", border: "2px solid #fecaca" }}
                    >
                        <IconX size={28} stroke={2.5} color="#dc2626" />
                    </div>
                </div>

                {/* Message */}
                <p
                    className="text-center text-[0.95rem] mb-6"
                    style={{ color: "#374151", lineHeight: 1.6 }}
                >
                    {labelMessage}
                </p>

                {/* Actions — Cancel first in LTR, Confirm first in RTL */}
                <div className="flex items-center gap-3">
                    {isRtl ? (
                        <>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "1px solid #dc2626" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                            >
                                {labelConfirm}
                            </button>
                            <button
                                ref={cancelRef}
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                style={{ backgroundColor: "var(--cream)", color: "var(--blue)", border: "1px solid var(--border)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                            >
                                {labelCancel}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                ref={cancelRef}
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                style={{ backgroundColor: "var(--cream)", color: "var(--blue)", border: "1px solid var(--border)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--blue)")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                            >
                                {labelCancel}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                style={{ backgroundColor: "#dc2626", color: "#ffffff", border: "1px solid #dc2626" }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
                            >
                                {labelConfirm}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}