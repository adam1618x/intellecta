"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CategoryKey } from "@/types";

interface TabItem {
    key: CategoryKey;
    slug: string;
    label: string;
}

interface Props {
    items: TabItem[];
    activeKey: CategoryKey;
}

/**
 * Client-side tabs.
 *
 * v1 rendered plain <Link>s inside the (server) layout, so `isActive` only
 * flipped once the whole route segment round-tripped from the server —
 * the clicked tab looked frozen until the data finished loading.
 *
 * v2 switched to <button onClick={() => router.push(...)}>, which fixed the
 * visual freeze but regressed navigation speed: manual router.push() skips
 * Next's automatic <Link> prefetching (Next prefetches a route's RSC
 * payload when the Link enters the viewport / on hover, so by the time you
 * click, the data is often already cached — a raw router.push() always
 * fetches fresh).
 *
 * v3 (this version): keep <Link> so prefetching is restored, and just piggy
 * -back an onClick that sets the optimistic "selected" state — WITHOUT
 * calling preventDefault, so Next's normal Link navigation still runs
 * underneath. We also explicitly router.prefetch() every tab on mount, so
 * prefetching doesn't depend on the tab having scrolled into view or been
 * hovered first.
 *
 * Note: `next dev` disables prefetching by default (Turbopack dev server),
 * so some of the ~90-140ms you saw in the log is expected only in dev —
 * production builds prefetch aggressively and should feel closer to
 * instant.
 */
export default function CategoryTabs({ items, activeKey }: Props) {
    const router = useRouter();
    const [optimisticKey, setOptimisticKey] = useState<CategoryKey>(activeKey);
    const didPrefetch = useRef(false);

    // Keep in sync once the real navigation completes (covers back/forward
    // nav, direct URL entry, etc. — anything that didn't go through a tab click).
    useEffect(() => {
        setOptimisticKey(activeKey);
    }, [activeKey]);

    // Eagerly prefetch every category once, so clicking a tab you haven't
    // hovered/scrolled to yet is still instant.
    useEffect(() => {
        if (didPrefetch.current) return;
        didPrefetch.current = true;
        items.forEach((item) => router.prefetch(item.slug));
    }, [items, router]);

    return (
        <div className="flex gap-2 overflow-x-auto p-1">
            {items.map(({ key, slug, label }) => {
                const isActive = key === optimisticKey;
                return (
                    <Link key={key} href={slug} prefetch onClick={() => setOptimisticKey(key)}
                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-600/15" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
