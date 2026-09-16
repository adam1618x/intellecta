"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

interface Props {
    href: string;
    label: string;
    /** Pass the current locale so the arrow points toward "back" (the
     * start of reading order) correctly in both RTL and LTR. */
    locale?: string;
}

export default function BackButton({ href, label, locale }: Props) {
    const isRtl = locale === "ar";

    return (
        <Link
            href={href}
            style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "var(--blue)", color: "white",
                padding: "10px 20px", borderRadius: "10px",
                fontFamily: "var(--font-arabic-body)", fontSize: "0.9rem",
                textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--blue-light)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--blue)")}
        >
            {/* "Back" points toward the start of reading order: right in
                RTL (no flip needed), left in LTR (flipped). */}
            <IconArrowRight size={16} style={{ transform: isRtl ? undefined : "scaleX(-1)" }} />
            {label}
        </Link>
    );
}