// src/app/[locale]/admin/(dashboard)/dashboard/page.tsx
import { prisma } from "@/lib/db";
import Link from "next/link";
import { IconBooks, IconMail, IconCategory } from "@tabler/icons-react";
import { getTranslations } from "next-intl/server";

const CATEGORY_KEYS = ["courses", "programming", "mathematics", "sciences", "business", "languages"] as const;

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations("admin");

    const [totalPubs, unreadMessages, categoryGroups] = await Promise.all([
        prisma.publication.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.publication.groupBy({
            by: ["category"],
            _count: { id: true },
        }),
    ]);

    const countByCategory = Object.fromEntries(
        categoryGroups.map((g) => [g.category, g._count.id])
    );

    return (
        <div dir={locale === "ar" ? "rtl" : "ltr"} className="p-8">
            {/* Header */}
            <div className="mb-8">
                <div
                    className="w-10 h-1 rounded-full mb-3"
                    style={{ backgroundColor: "var(--blue)" }}
                />
                <h2
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}
                >
                    {t("nav.dashboard")}
                </h2>
                <p className="text-base mt-1.5" style={{ color: "#6b7280" }}>
                    {t("site.title")}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <StatCard
                    label={t("modal.fields.translations")}
                    value={totalPubs}
                    icon={<IconBooks size={26} stroke={1.75} />}
                />
                <StatCard
                    label={t("nav.messages")}
                    value={unreadMessages}
                    icon={<IconMail size={26} stroke={1.75} />}
                    highlight={unreadMessages > 0}
                />
                <StatCard
                    label={t("nav.publications")}
                    value={CATEGORY_KEYS.length}
                    icon={<IconCategory size={26} stroke={1.75} />}
                />
            </div>

            {/* Categories */}
            <div className="mb-4 flex items-center gap-3">
                <div
                    className="w-1.5 h-6 rounded-full"
                    style={{ backgroundColor: "var(--blue)" }}
                />
                <h3
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}
                >
                    {t("nav.publications")}
                </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORY_KEYS.map((key) => (
                    <Link
                        key={key}
                        href={`/${locale}/admin/courses/${key}`}
                        className="block rounded-xl p-5 transition-all hover:shadow-md cursor-pointer"
                        style={{
                            backgroundColor: "var(--white)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="text-lg font-bold"
                                style={{ fontFamily: "var(--font-arabic-display)", color: "var(--blue)" }}
                            >
                                {t(`categories.${key}`)}
                            </span>
                            <span
                                className="text-2xl font-bold"
                                style={{ color: "var(--blue)" }}
                            >
                                {countByCategory[key] ?? 0}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
    highlight = false,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    highlight?: boolean;
}) {
    return (
        <div
            className="rounded-xl p-5 flex items-center gap-4"
            style={{
                backgroundColor: highlight ? "#fef3c7" : "var(--white)",
                border: `1px solid ${highlight ? "var(--blue)" : "var(--border)"}`,
            }}
        >
            <div
                className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
                style={{
                    backgroundColor: highlight ? "rgba(37,99,235,0.15)" : "var(--blue-pale)",
                    color: highlight ? "var(--blue)" : "var(--blue)",
                }}
            >
                {icon}
            </div>
            <div>
                <div
                    className="text-2xl font-bold"
                    style={{ color: highlight ? "var(--blue)" : "var(--blue)" }}
                >
                    {value}
                </div>
                <div className="text-sm mt-0.5" style={{ color: "#6b7280" }}>
                    {label}
                </div>
            </div>
        </div>
    );
}
