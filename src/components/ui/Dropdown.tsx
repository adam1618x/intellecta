"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Item {
    label: ReactNode;
    href?: string;
    icon?: ReactNode;
    onClick?: () => void;
}

interface DropdownProps {
    trigger: ReactNode;
    items: Item[];
}

export default function Dropdown({ trigger, items }: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative h-full flex items-stretch">
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center h-full px-4"
            >
                {trigger}
            </button>

            {/* Content */}
            {open && (
                <div className="absolute top-full end-0 mt-2 min-w-[220px] rounded-xl overflow-hidden bg-[#0f172a]/95 backdrop-blur-md border border-blue/20 shadow-xl z-50">
                    {items.map((item, i) =>
                        item.href ? (
                            <Link
                                key={i}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            <button
                                key={i}
                                onClick={() => {
                                    item.onClick?.();
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}