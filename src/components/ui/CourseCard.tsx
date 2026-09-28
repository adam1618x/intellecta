import Link from "next/link";
import { IconArrowUpRight, IconUser } from "@tabler/icons-react";
interface Props {
  href: string;
  title: string;
  excerpt: string;
  categoryKey: string;
  categoryLabel: string;
  author?: string;
  readMore?: string;
}
export default function CourseCard({
  href,
  title,
  excerpt,
  categoryLabel,
  author,
  readMore,
}: Props) {
  return (
    <Link href={href} className="course-card group">
      <div className="flex items-center justify-between gap-3">
        <span className="course-badge">{categoryLabel}</span>
        <IconArrowUpRight
          size={17}
          className="text-blue-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </div>
      <h3 className="mt-5 font-display text-xl font-extrabold leading-snug text-slate-950">
        {title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
        {excerpt}
      </p>
      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="h-1 w-12 rounded-full bg-blue-600 transition-all group-hover:w-20" />
        {author && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <IconUser size={13} />
            {author}
          </span>
        )}
        {readMore && (
          <span className="text-[11px] font-extrabold text-blue-600">
            {readMore}
          </span>
        )}
      </div>
    </Link>
  );
}
