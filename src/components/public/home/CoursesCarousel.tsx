"use client";

import { Children, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface Props {
  children: ReactNode;
  rtl: boolean;
  prevLabel: string;
  nextLabel: string;
  slideLabel: string;
}

export default function CoursesCarousel({ children, rtl, prevLabel, nextLabel, slideLabel }: Props) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const [selected, setSelected] = useState(0);
  const drag = useRef({ x: 0, active: false, moved: false });
  const dir = rtl ? -1 : 1;

  const go = (i: number) => setSelected(((i % n) + n) % n);
  const next = () => go(selected + 1);
  const prev = () => go(selected - 1);

  // shortest circular distance from the active slide
  const offsetOf = (i: number) => {
    let d = (((i - selected) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const onPointerDown = (e: PointerEvent) => {
    drag.current = { x: e.clientX, active: true, moved: false };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = drag.current;
    if (!s.active) return;
    s.active = false;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50) {
      s.moved = true;
      // dragging toward the "start" side reveals the next slide
      (dx < 0 ? dir === 1 : dir === -1) ? next() : prev();
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (rtl ? prev : next)();
    if (e.key === "ArrowLeft") (rtl ? next : prev)();
  };

  const PrevIcon = rtl ? IconChevronRight : IconChevronLeft;
  const NextIcon = rtl ? IconChevronLeft : IconChevronRight;
  const btn =
    "grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-800 shadow-md shadow-blue-900/10 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:ring-blue-600 active:scale-95";

  return (
    <div dir={rtl ? "rtl" : "ltr"} onKeyDown={onKeyDown} tabIndex={0} className="outline-none">
      {/* stage */}
      <div
        className="grid touch-pan-y select-none overflow-hidden py-8 [--step:82%] sm:[--step:100%] lg:[--step:106%]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current.active = false)}
      >
        {slides.map((slide, i) => {
          const d = offsetOf(i);
          const abs = Math.abs(d);
          const isActive = d === 0;
          const visible = abs <= 1;

          return (
            <div
              key={i}
              aria-hidden={!isActive}
              onClickCapture={(e) => {
                if (drag.current.moved) {
                  drag.current.moved = false;
                  e.preventDefault();
                  e.stopPropagation();
                } else if (!isActive) {
                  e.preventDefault();
                  e.stopPropagation();
                  go(i);
                }
              }}
              style={{
                transform: `translateX(calc(var(--step) * ${d * dir})) scale(${isActive ? 1 : abs === 1 ? 0.85 : 0.7})`,
              }}
              className={[
                "col-start-1 row-start-1 w-[78%] justify-self-center transition-all duration-500 ease-out sm:w-[60%] lg:w-[42%]",
                isActive ? "z-10 opacity-100" : visible ? "z-0 cursor-pointer opacity-40" : "pointer-events-none z-0 opacity-0",
              ].join(" ")}
            >
              <div
                className={`h-full rounded-3xl transition-shadow duration-500 ${
                  isActive ? "shadow-2xl shadow-blue-900/15 ring-1 ring-blue-200/70" : "ring-1 ring-slate-200"
                }`}
              >
                {slide}
              </div>
            </div>
          );
        })}
      </div>

      {/* controls */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <button type="button" onClick={prev} aria-label={prevLabel} className={btn}>
          <PrevIcon size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-extrabold text-white shadow-md shadow-blue-600/25">
            {slideLabel} {selected + 1}
          </span>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${slideLabel} ${i + 1}`}
                aria-current={i === selected}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === selected ? "w-6 bg-blue-600" : "w-2.5 bg-slate-300 hover:bg-blue-300"
                }`}
              />
            ))}
          </div>
        </div>

        <button type="button" onClick={next} aria-label={nextLabel} className={btn}>
          <NextIcon size={20} />
        </button>
      </div>
    </div>
  );
}