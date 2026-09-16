"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { IconPlus, IconChevronRight, IconChevronLeft, IconX, IconLoader2 } from "@tabler/icons-react";
import CourseModal, { type ModalPublication } from "@/components/admin/CourseModal";
import ConfirmModal from "@/components/admin/ConfirmModal";

const LOCALE_BCP47: Record<string, string> = {
    ar: "ar-TN",
    en: "en-GB",
    fr: "fr-FR",
    ms: "ms-MY",
};

type Publication = {
    id: number;
    author: string | null;
    publishedAt: string;
    title: string | null;
    excerpt: string | null;
};

type ModalState =
    | { open: false }
    | { open: true; mode: "add" }
    | { open: true; mode: "edit"; publication: ModalPublication };

export default function PublicationsCategoryPage() {
    const { category, locale } = useParams<{ category: string; locale: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations("admin");
    const isRtl = locale === "ar";
    const bcp47 = LOCALE_BCP47[locale] ?? "en-GB";

    const label = t(`categories.${category as "courses" | "programming" | "mathematics" | "sciences" | "business" | "languages"}`);

    const [publications, setPublications] = useState<Publication[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);
    const [modal, setModal] = useState<ModalState>({ open: false });
    const [confirmId, setConfirmId] = useState<number | null>(null);

    async function load(p = 1) {
        setLoading(true);
        const res = await fetch(
            `/api/courses/${category}?locale=${locale}&page=${p}&limit=10`
        );
        const json = await res.json();
        setPublications(json.data ?? []);
        setTotal(json.pagination?.total ?? 0);
        setLoading(false);
    }

    useEffect(() => { load(page); }, [page, category]);

    // Handle ?edit=<id> query param (from the /edit redirect page)
    useEffect(() => {
        const editId = searchParams.get("edit");
        if (!editId) return;
        router.replace(`/${locale}/admin/courses/${category}`);
        const id = /^[1-9]\d*$/.test(editId) ? Number(editId) : NaN;
        if (Number.isSafeInteger(id)) openEditModal(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    async function handleDelete(id: number) {
        setDeleting(id);
        await fetch(`/api/courses/${category}/${id}`, { method: "DELETE" });
        await load(page);
        setDeleting(null);
        setConfirmId(null);
    }

    async function openEditModal(id: number) {
        const res = await fetch(`/api/courses/${category}/${id}`);
        const pub: ModalPublication = await res.json();
        setModal({ open: true, mode: "edit", publication: pub });
    }

    const totalPages = Math.ceil(total / 10);
    const PrevIcon = isRtl ? IconChevronRight : IconChevronLeft;
    const NextIcon = isRtl ? IconChevronLeft : IconChevronRight;

    return (
        <>
            <div dir={isRtl ? "rtl" : "ltr"} className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: "var(--blue)" }} />
                        <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}>
                            {label}
                        </h2>
                        <p className="text-base mt-1.5" style={{ color: "#6b7280" }}>{total}</p>
                    </div>
                    <button
                        onClick={() => setModal({ open: true, mode: "add" })}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                        style={{ backgroundColor: "var(--blue)", color: "var(--white)" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--blue-light)"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--blue)"}
                    >
                        <IconPlus size={18} stroke={2} />
                        <span>{t("modal.addTitle")}</span>
                    </button>
                </div>

                {/* Table */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", backgroundColor: "var(--white)" }}>
                    {loading ? (
                        <div className="py-16 flex items-center justify-center gap-2 text-sm" style={{ color: "var(--blue)" }}>
                            <IconLoader2 size={18} className="animate-spin" />
                        </div>
                    ) : publications.length === 0 ? (
                        <div className="py-16 text-center" style={{ color: "#9ca3af" }}>
                            <p className="text-sm">{t("publications.empty")}</p>
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
                                        {t("table.published")}
                                    </th>
                                    <th className="px-4 py-3 text-start font-medium text-[0.9rem]" style={{ color: "var(--blue)" }}>
                                        {t("table.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {publications.map((pub, i) => (
                                    <tr
                                        key={pub.id}
                                        style={{ borderBottom: i < publications.length - 1 ? "1px solid var(--border)" : "none" }}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-[0.95rem]" style={{ fontFamily: "var(--font-arabic-body)", color: "var(--black)" }}>
                                                {pub.title ?? `#${pub.id}`}
                                            </div>
                                            <div className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>#{pub.id}</div>
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {pub.author ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-[0.9rem]" style={{ color: "#6b7280" }}>
                                            {new Date(pub.publishedAt).toLocaleDateString(bcp47)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(pub.id)}
                                                    className="px-3 py-1.5 rounded text-sm transition-all cursor-pointer"
                                                    style={{ backgroundColor: "var(--blue-pale)", color: "var(--blue)", border: "1px solid var(--blue-pale)" }}
                                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--blue)"}
                                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--blue-pale)"}
                                                >
                                                    {t("actions.edit")}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmId(pub.id)}
                                                    disabled={deleting === pub.id}
                                                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed"
                                                    style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                                                    onMouseEnter={(e) => { if (deleting !== pub.id) e.currentTarget.style.borderColor = "#dc2626"; }}
                                                    onMouseLeave={(e) => { if (deleting !== pub.id) e.currentTarget.style.borderColor = "#fecaca"; }}
                                                >
                                                    {deleting === pub.id
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
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

            {modal.open && (
                <CourseModal
                    mode={modal.mode}
                    category={category}
                    publication={modal.mode === "edit" ? modal.publication : undefined}
                    onClose={() => setModal({ open: false })}
                    onSaved={() => load(page)}
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
