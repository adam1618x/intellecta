"use client";

import { useState } from "react";
import Image from "next/image";

export interface GalleryPhoto {
    src: string;
    alt: string;
    caption?: string;
}

interface PhotoGalleryProps {
    photos: GalleryPhoto[];
    title?: string;
    aboveFoldCount?: number;
}

export default function PhotoGallery({ photos, title, aboveFoldCount = 2 }: PhotoGalleryProps) {
    const [lightbox, setLightbox] = useState<number | null>(null);

    const prev = () =>
        setLightbox((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null));
    const next = () =>
        setLightbox((i) => (i !== null ? (i + 1) % photos.length : null));

    return (
        <>
            {/* ── Grid ── */}
            {title && (
                <h2
                    className="text-2xl font-bold mb-4 pb-3"
                    style={{
                        color: "var(--blue)",
                        fontFamily: "var(--font-arabic-display)",
                        borderBottom: "1px solid var(--border)",
                    }}
                >
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {photos.map((photo, idx) => (
                    <button
                        key={idx}
                        onClick={() => setLightbox(idx)}
                        className="group relative overflow-hidden cursor-pointer focus:outline-none"
                        style={{
                            aspectRatio: "1 / 1",
                            border: "0.5px solid var(--border)",
                        }}
                    >
                        <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            priority={idx < aboveFoldCount}
                            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* overlay */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                            style={{ background: "linear-gradient(to top, rgba(22,70,45,0.75), transparent)" }}
                        >
                            {photo.caption && (
                                <p
                                    className="w-full px-3 py-2 text-xs text-white text-start"
                                    style={{ fontFamily: "var(--font-arabic-body)" }}
                                >
                                    {photo.caption}
                                </p>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* ── Lightbox ── */}
            {lightbox !== null && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.92)" }}
                    onClick={() => setLightbox(null)}
                >
                    {/* close */}
                    <button
                        className="absolute top-5 left-5 text-white/70 hover:text-white text-3xl leading-none cursor-pointer"
                        onClick={() => setLightbox(null)}
                    >
                        ✕
                    </button>

                    {/* Right Button (RTL Backward Progression) */}
                    <button
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                    >
                        ›
                    </button>

                    {/* image container */}
                    <div
                        className="relative w-[90vw] max-w-2xl"
                        style={{ aspectRatio: "4 / 3" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={photos[lightbox].src}
                            alt={photos[lightbox].alt}
                            fill
                            sizes="(max-width: 768px) 90vw, 672px"
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Left Button (RTL Forward Progression) */}
                    <button
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); next(); }}
                    >
                        ‹
                    </button>

                    {/* caption */}
                    {photos[lightbox].caption && (
                        <p
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm text-center"
                            style={{ fontFamily: "var(--font-arabic-body)" }}
                        >
                            {photos[lightbox].caption}
                        </p>
                    )}

                    {/* counter */}
                    <p className="absolute top-5 right-1/2 translate-x-1/2 text-white/50 text-xs">
                        {lightbox + 1} / {photos.length}
                    </p>
                </div>
            )}
        </>
    );
}