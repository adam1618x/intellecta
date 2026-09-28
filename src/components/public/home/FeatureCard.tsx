import Link from "next/link";
import type { ComponentType } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";

interface Props {
  href: string;
  title: string;
  description: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
}

export default function FeatureCard({ href, title, description, Icon }: Props) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-3xl border border-slate-200/80 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/[0.07]"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
        <Icon size={22} />
      </div>
      <h3 className="mt-7 font-display text-xl font-extrabold text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-500">{description}</p>
      <IconArrowUpRight
        size={18}
        className="absolute end-7 top-8 text-slate-300 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-600 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
  );
}