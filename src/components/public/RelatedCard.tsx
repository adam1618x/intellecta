// src/components/public/RelatedCard.tsx
"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

interface Props {
    href: string;
    title: string | null;
    excerpt: string | null;
    readMore: string;
    /** Current locale, used to point the "read more" arrow toward the
     * end of reading order in both RTL and LTR. */
    locale?: string;
}

export default function RelatedCard({ href, title, excerpt, readMore, locale }: Props) {
    const isRtl = locale === "ar";

    return (
        <Link
            href={href}
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) => {
                const el = e.currentTarget.firstChild as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.borderColor = "var(--blue)";
            }}
            onMouseLeave={(e) => {
                const el = e.currentTarget.firstChild as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "var(--border)";
            }}
        >
            <div style={{
                background: "white", border: "0.5px solid var(--border)",
                borderRadius: "12px", padding: "1.25rem",
                transition: "transform 0.2s, border-color 0.2s", height: "100%",
            }}>
                <h3 style={{ fontFamily: "var(--font-arabic-display)", fontSize: "1rem", fontWeight: 700, color: "var(--blue)", marginBottom: "0.6rem", lineHeight: 1.6 }}>
                    {title ?? "—"}
                </h3>
                <p style={{
                    fontFamily: "var(--font-arabic-body)", fontSize: "0.85rem", color: "#777",
                    lineHeight: 1.8, marginBottom: "1rem",
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                } as React.CSSProperties}>
                    {excerpt ?? ""}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--blue)", fontSize: "0.8rem", fontFamily: "var(--font-arabic-body)" }}>
                    {readMore}
                    {/* "Read more" points toward the end of reading order:
                        right in LTR (no flip), left in RTL (flipped). */}
                    <IconArrowRight size={13} style={{ transform: isRtl ? "scaleX(-1)" : undefined }} />
                </div>
            </div>
        </Link>
    );
}