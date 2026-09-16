"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    IconPlus,
    IconPencil,
    IconX,
    IconLoader2,
    IconBook,
} from "@tabler/icons-react";
import BookModal, { type ModalBook } from "@/components/admin/BookModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

type Book = {
    id: number;
    title: string;
    author: string | null;
    description: string | null;
    year: string | null;
    pages: string | null;
    downloadUrl: string | null;
    createdAt: string;
};

type ModalState =
    | { open: false }
    | { open: true; mode: "add" }
    | { open: true; mode: "edit"; book: ModalBook };

export default function AdminBooksPage() {
    const { locale } = useParams<{ locale: string }>();
    const t = useTranslations("admin");
    const isRtl = locale === "ar";

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [modal, setModal] = useState<ModalState>({ open: false });
    const [confirmId, setConfirmId] = useState<number | null>(null);

    async function load() {
        setLoading(true);
        const res = await fetch("/api/resources");
        const json = await res.json();
        setBooks(json.data ?? []);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    async function handleDelete(id: number) {
        setDeleting(id);
        await fetch(`/api/resources/${id}`, { method: "DELETE" });
        await load();
        setDeleting(null);
        setConfirmId(null);
    }

    return (
        <>
            <div dir={isRtl ? "rtl" : "ltr"} className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--blue)" }} />
                        <h2
                            className="text-3xl font-bold"
                            style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}
                        >
                            {t("books.pageTitle")}
                        </h2>
                        <p className="text-base mt-1.5" style={{ color: "#6b7280" }}>
                            {books.length} {t("books.total")}
                        </p>
                    </div>
                    <button
                        onClick={() => setModal({ open: true, mode: "add" })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                        style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--blue-light)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--blue)"}
                    >
                        <IconPlus size={18} stroke={2} />
                        <span>{t("books.modal.addTitle")}</span>
                    </button>
                </div>

                {/* Table */}
                <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "1px solid var(--border)", backgroundColor: "var(--white)" }}
                >
                    {loading ? (
                        <div className="py-16 flex items-center justify-center gap-2 text-sm" style={{ color: "var(--blue)" }}>
                            <IconLoader2 size={18} className="animate-spin" />
                        </div>
                    ) : books.length === 0 ? (
                        <div className="py-16 text-center" style={{ color: "#9ca3af" }}>
                            <IconBook size={32} className="mx-auto mb-3 opacity-40" />
                            <p className="text-sm">{t("books.empty")}</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--cream)" }}>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.title")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.author")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("books.table.year")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("books.table.pages")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book, i) => (
                                    <tr
                                        key={book.id}
                                        style={{ borderBottom: i < books.length - 1 ? "1px solid var(--border)" : "none" }}
                                    >
                                        <td className="px-4 py-3">
                                            <div
                                                className="font-medium text-[0.95rem]"
                                                style={{ fontFamily: "var(--font-arabic-body)", color: "var(--black)" }}
                                            >
                                                {book.title}
                                            </div>
                                            {book.downloadUrl && (
                                                <div className="text-xs mt-0.5 truncate max-w-[200px]" style={{ color: "#9ca3af" }}>
                                                    {book.downloadUrl}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {book.author ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {book.year ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {book.pages ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setModal({ open: true, mode: "edit", book })}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-all cursor-pointer"
                                                    style={{
                                                        backgroundColor: "var(--blue-pale)",
                                                        color: "var(--blue)",
                                                        border: "1px solid var(--blue-pale)",
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--blue)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--blue-pale)"}
                                                >
                                                    <IconPencil size={14} stroke={2} />
                                                    {t("actions.edit")}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(book.id)}
                                                    disabled={deleting === book.id}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                                                    style={{
                                                        backgroundColor: "#fef2f2",
                                                        color: "#dc2626",
                                                        border: "1px solid #fecaca",
                                                    }}
                                                    onMouseEnter={(e) => { if (deleting !== book.id) e.currentTarget.style.borderColor = "#dc2626"; }}
                                                    onMouseLeave={(e) => { if (deleting !== book.id) e.currentTarget.style.borderColor = "#fecaca"; }}
                                                >
                                                    {deleting === book.id
                                                        ? <IconLoader2 size={14} className="animate-spin" />
                                                        : <IconX size={14} stroke={2.5} />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {modal.open && (
                <BookModal
                    mode={modal.mode}
                    book={modal.mode === "edit" ? modal.book : undefined}
                    onClose={() => setModal({ open: false })}
                    onSaved={load}
                />
            )}

            <ConfirmModal
                locale={locale}
                open={confirmId !== null}
                onConfirm={() => confirmId !== null && handleDelete(confirmId)}
                onCancel={() => setConfirmId(null)}
            />
        </>
    );
}
