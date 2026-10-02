import Link from "next/link";
import Image from "next/image";
import {
  IconArrowUpRight,
  IconBook2,
  IconCircleCheck,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

interface Props {
  href: string;
  title: string;
  excerpt: string;
  categoryKey: string;
  categoryLabel: string;
  author?: string;
  readMore?: string;
  image?: string;
  imageAlt?: string;
  enrolled?: number;
  completed?: number;
  enrolledLabel?: string;
  completedLabel?: string;
}

export default function CourseCard({
  href,
  title,
  excerpt,
  categoryLabel,
  author,
  readMore,
  image,
  imageAlt,
  enrolled,
  completed,
  enrolledLabel,
  completedLabel,
}: Props) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
            <IconBook2 size={48} className="text-white/70" stroke={1.5} />
          </div>
        )}

        {/* Bottom fade for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-blue-700 shadow-sm backdrop-blur">
          {categoryLabel}
        </span>

        {/* Arrow button */}
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-blue-600 shadow-sm backdrop-blur transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
          <IconArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 font-display text-xl font-extrabold leading-snug text-slate-950 transition-colors group-hover:text-blue-700">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
          {excerpt}
        </p>

        {/* Stats */}
        {(enrolled !== undefined || completed !== undefined) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            {enrolled !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <IconUsers size={14} className="text-blue-500" />
                <span className="font-semibold text-slate-700">
                  {enrolled.toLocaleString()}
                </span>
                {enrolledLabel}
              </span>
            )}
            {completed !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <IconCircleCheck size={14} className="text-emerald-500" />
                <span className="font-semibold text-slate-700">
                  {completed.toLocaleString()}
                </span>
                {completedLabel}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          {author ? (
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <IconUser size={14} />
              </span>
              {author}
            </span>
          ) : (
            <span />
          )}

          {readMore && (
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600">
              {readMore}
              <IconArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}