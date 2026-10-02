"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    depth: number;       // 0 = proche/bleu, 1 = loin/violet
    baseRadius: number;
    phase: number;       // pulsation
    pulseSpeed: number;
}

interface Band {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

const MAX_DISTANCE = 120;
const BLUE: [number, number, number] = [21, 84, 184];
const VIOLET: [number, number, number] = [124, 92, 240];
const MARGIN = 28; // écart minimum garanti avec AuthCard

function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] as const;
}

function getCardRect(wrap: HTMLElement, selector: string) {
    const candidates = Array.from(wrap.querySelectorAll<HTMLElement>(selector));
    const el = candidates.find((c) => c.offsetWidth > 0) ?? null;
    if (!el) return null;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
        left: elRect.left - wrapRect.left,
        top: elRect.top - wrapRect.top,
        right: elRect.right - wrapRect.left,
        bottom: elRect.bottom - wrapRect.top,
    };
}

function buildBands(width: number, height: number, card: ReturnType<typeof getCardRect>): Band[] {
    if (!card) return [{ x0: 0, y0: 0, x1: width, y1: height }];

    const bands: Band[] = [];
    const leftW = card.left - MARGIN * 2;
    const rightW = width - card.right - MARGIN * 2;
    const topH = card.top - MARGIN * 2;

    if (leftW > 30) bands.push({ x0: 0, y0: 0, x1: leftW, y1: height });
    if (rightW > 30) bands.push({ x0: width - rightW, y0: 0, x1: width, y1: height });
    if (topH > 30) bands.push({ x0: 0, y0: 0, x1: width, y1: topH });

    return bands.length ? bands : [{ x0: 0, y0: 0, x1: width, y1: Math.max(1, card.top - MARGIN) }];
}

function randomInBand(band: Band): { x: number; y: number } {
    return {
        x: band.x0 + Math.random() * (band.x1 - band.x0),
        y: band.y0 + Math.random() * (band.y1 - band.y0),
    };
}

export default function ParticleNetwork({ cardSelector = ".auth-card, .auth-card-mobile" }: { cardSelector?: string } = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = canvas?.parentElement;
        if (!canvas || !wrap) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let particles: Particle[] = [];
        let bands: Band[] = [];
        let cardRect: ReturnType<typeof getCardRect> = null;
        let rafId = 0;
        let running = true;
        let startTime = performance.now();

        function createParticles() {
            const totalArea = bands.reduce((sum, b) => sum + (b.x1 - b.x0) * (b.y1 - b.y0), 0);
            const count = Math.max(16, Math.min(70, Math.round(totalArea / 15000)));
            particles = Array.from({ length: count }, () => {
                const band = bands[Math.floor(Math.random() * bands.length)];
                const pos = randomInBand(band);
                const depth = Math.random();
                return {
                    x: pos.x,
                    y: pos.y,
                    vx: (Math.random() - 0.5) * 0.12,
                    vy: (Math.random() - 0.5) * 0.12,
                    depth,
                    baseRadius: 1.1 + depth * 1.6,
                    phase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.6 + Math.random() * 0.5,
                };
            });
        }

        function resize() {
            if (!canvas || !wrap) return;
            width = wrap.clientWidth;
            height = wrap.clientHeight;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
            const rect = getCardRect(wrap, cardSelector);
            // écran étroit : plus de place sur les côtés → particules sur tout l'écran, derrière la carte
            const sideRoom = rect ? Math.max(rect.left, width - rect.right) - MARGIN * 2 : Infinity;
            cardRect = sideRoom > 30 ? rect : null;
            bands = buildBands(width, height, cardRect);
            createParticles();
        }

        function keepOutOfCard(p: Particle) {
            if (!cardRect) return;
            const safeLeft = cardRect.left - MARGIN;
            const safeTop = cardRect.top - MARGIN;
            const safeRight = cardRect.right + MARGIN;
            const safeBottom = cardRect.bottom + MARGIN;

            if (p.x > safeLeft && p.x < safeRight && p.y > safeTop && p.y < safeBottom) {
                const distLeft = p.x - safeLeft;
                const distRight = safeRight - p.x;
                const distTop = p.y - safeTop;
                const distBottom = safeBottom - p.y;
                const min = Math.min(distLeft, distRight, distTop, distBottom);

                if (min === distLeft) { p.x = safeLeft; p.vx = -Math.abs(p.vx) || -0.08; }
                else if (min === distRight) { p.x = safeRight; p.vx = Math.abs(p.vx) || 0.08; }
                else if (min === distTop) { p.y = safeTop; p.vy = -Math.abs(p.vy) || -0.08; }
                else { p.y = safeBottom; p.vy = Math.abs(p.vy) || 0.08; }
            }
        }

        function draw(elapsed: number) {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                p.vx += (Math.random() - 0.5) * 0.004;
                p.vy += (Math.random() - 0.5) * 0.004;
                p.vx = Math.max(-0.22, Math.min(0.22, p.vx));
                p.vy = Math.max(-0.22, Math.min(0.22, p.vy));

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                keepOutOfCard(p);
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MAX_DISTANCE) {
                        const proximity = 1 - dist / MAX_DISTANCE;
                        const opacity = 0.1 + proximity * 0.2; // 10–30%
                        const [r, g, bch] = lerpColor(BLUE, VIOLET, (a.depth + b.depth) / 2);
                        ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${bch | 0}, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                const pulse = 0.55 + 0.45 * Math.sin(elapsed * 0.001 * p.pulseSpeed + p.phase);
                const radius = p.baseRadius * (0.85 + pulse * 0.3);
                const [r, g, bch] = lerpColor(BLUE, VIOLET, p.depth);
                const alpha = 0.3 + pulse * 0.35;
                ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${bch | 0}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function tick(timestamp: number) {
            if (!running) return;
            draw(timestamp - startTime);
            rafId = requestAnimationFrame(tick);
        }

        resize();

        if (reduceMotion) {
            draw(0);
        } else {
            rafId = requestAnimationFrame(tick);
        }

        function handleResize() {
            resize();
            if (reduceMotion) draw(0);
        }

        function handleVisibility() {
            running = document.visibilityState === "visible";
            if (running && !reduceMotion) {
                startTime = performance.now();
                rafId = requestAnimationFrame(tick);
            } else {
                cancelAnimationFrame(rafId);
            }
        }

        const ro = new ResizeObserver(handleResize);
        ro.observe(wrap);
        wrap.querySelectorAll(cardSelector).forEach((el) => ro.observe(el));
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [cardSelector]);

    return <canvas ref={canvasRef} className="auth-particles" aria-hidden="true" />;
}