"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    IconChevronRight,
    IconChevronLeft,
    IconMailOpened,
    IconMail,
    IconX,
    IconLoader2,
    IconInbox,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import ContactModal, { type ModalContactMessage } from "@/components/admin/ContactModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    locale: string;
    read: boolean;
    createdAt: string;
};

type ReadFilter = "all" | "unread" | "read";

const LOCALE_BCP47: Record<string, string> = {
    ar: "ar-TN",
    en: "en-GB",
    fr: "fr-FR",
    ms: "ms-MY",
};

export default function AdminContactPage() {
    const { locale } = useParams<{ locale: string }>();
    const t = useTranslations("admin");
    const isRtl = locale === "ar";
    const bcp47 = LOCALE_BCP47[locale] ?? "en-GB";

    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState<ReadFilter>("all");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [opening, setOpening] = useState<number | null>(null);
    const [modal, setModal] = useState<ModalContactMessage | null>(null);
    const [confirmId, setConfirmId] = useState<number | null>(null);

    async function load(p = 1, f: ReadFilter = filter) {
        setLoading(true);
        const readParam = f === "unread" ? "&read=false" : f === "read" ? "&read=true" : "";
        const res = await fetch(`/api/contact?page=${p}&limit=10${readParam}`);
        const json = await res.json();
        setMessages(json.data ?? []);
        setTotal(json.pagination?.total ?? 0);
        setLoading(false);
    }

    useEffect(() => {
        load(page, filter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, filter]);

    function handleFilterChange(f: ReadFilter) {
        setFilter(f);
        setPage(1);
    }

    async function handleOpen(msg: ContactMessage) {
        setOpening(msg.id);
        const res = await fetch(`/api/contact/${msg.id}`);
        const full: ModalContactMessage = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
        setModal(full);
        setOpening(null);
    }

    function handleReadToggled(id: number, read: boolean) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
    }

    async function handleDeleteFromList(id: number) {
        setDeleting(id);
        await fetch(`/api/contact/${id}`, { method: "DELETE" });
        await load(page, filter);
        setDeleting(null);
        setConfirmId(null);
    }

    async function handleToggleReadFromList(msg: ContactMessage, read: boolean) {
        await fetch(`/api/contact/${msg.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ read }),
        });
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read } : m)));
    }

    const totalPages = Math.ceil(total / 10);
    const PrevIcon = isRtl ? IconChevronRight : IconChevronLeft;
    const NextIcon = isRtl ? IconChevronLeft : IconChevronRight;

    const filterTabs: { key: ReadFilter; label: string }[] = [
        { key: "all", label: t("filter.all") },
        { key: "unread", label: t("filter.unread") },
        { key: "read", label: t("filter.read") },
    ];

    return (
        <>
            <div dir={isRtl ? "rtl" : "ltr"} className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--blue)" }} />
                        <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}>
                            {t("nav.messages")}
                        </h2>
                        <p className="text-base mt-1.5" style={{ color: "#6b7280" }}>{total}</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border)" }}>
                        {filterTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleFilterChange(tab.key)}
                                className="px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer"
                                style={{
                                    backgroundColor: filter === tab.key ? "var(--blue)" : "transparent",
                                    color: filter === tab.key ? "var(--white)" : "var(--blue)",
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", backgroundColor: "var(--white)" }}>
                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-2 text-sm" style={{ color: "var(--blue)" }}>
                            <IconLoader2 size={22} stroke={2} className="animate-spin" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-2 text-sm" style={{ color: "#9ca3af" }}>
                            <IconInbox size={28} stroke={1.5} />
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--cream)" }}>
                                    <th className="px-4 py-3 w-6" />
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.sender")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.subject")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.date")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((msg, i) => (
                                    <tr
                                        key={msg.id}
                                        onClick={() => handleOpen(msg)}
                                        className="cursor-pointer transition-colors"
                                        style={{ borderBottom: i < messages.length - 1 ? "1px solid var(--border)" : "none" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--cream)"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                                    >
                                        <td className="px-4 py-3 w-6">
                                            {opening === msg.id ? (
                                                <IconLoader2 size={14} stroke={2} className="animate-spin" style={{ color: "var(--blue)" }} />
                                            ) : !msg.read ? (
                                                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: "var(--blue)" }} />
                                            ) : null}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div
                                                className="text-[0.95rem]"
                                                style={{ fontFamily: "var(--font-arabic-body)", color: "var(--black)", fontWeight: msg.read ? 400 : 700 }}
                                            >
                                                {msg.name}
                                            </div>
                                            <div className="text-sm mt-0.5" style={{ color: "#9ca3af" }}>{msg.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {msg.subject ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {new Date(msg.createdAt).toLocaleDateString(bcp47)}
                                        </td>
                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleReadFromList(msg, !msg.read)}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer"
                                                    style={{ backgroundColor: "var(--blue-pale)", color: "var(--blue)", border: "1px solid var(--blue-pale)" }}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--blue)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--blue-pale)"}
                                                    title={msg.read ? t("actions.markUnread") : t("actions.markRead")}
                                                >
                                                    {msg.read ? <IconMail size={15} stroke={2} /> : <IconMailOpened size={15} stroke={2} />}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(msg.id)}
                                                    disabled={deleting === msg.id}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                                                    style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                                                    onMouseEnter={(e) => { if (deleting !== msg.id) e.currentTarget.style.borderColor = "#dc2626"; }}
                                                    onMouseLeave={(e) => { if (deleting !== msg.id) e.currentTarget.style.borderColor = "#fecaca"; }}
                                                >
                                                    {deleting === msg.id
                                                        ? <IconLoader2 size={15} stroke={2} className="animate-spin" />
                                                        : <IconX size={15} stroke={2.5} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 py-4" style={{ borderTop: "1px solid var(--border)" }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                                style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", color: page === 1 ? "#9ca3af" : "var(--blue)" }}
                            >
                                <PrevIcon size={18} stroke={2} />
                            </button>
                            <span className="text-sm" style={{ color: "#6b7280" }}>{page} / {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
                                style={{ backgroundColor: "var(--white)", border: "1px solid var(--border)", color: page === totalPages ? "#9ca3af" : "var(--blue)" }}
                            >
                                <NextIcon size={18} stroke={2} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {modal && (
                <ContactModal
                    message={modal}
                    locale={locale}
                    onClose={() => setModal(null)}
                    onDeleted={(id) => {
                        setMessages((prev) => prev.filter((m) => m.id !== id));
                        setTotal((total) => total - 1);
                    }}
                    onReadToggled={handleReadToggled}
                />
            )}

            <ConfirmModal
                locale={locale}
                open={confirmId !== null}
                onConfirm={() => confirmId !== null && handleDeleteFromList(confirmId)}
                onCancel={() => setConfirmId(null)}
            />
        </>
    );
}
