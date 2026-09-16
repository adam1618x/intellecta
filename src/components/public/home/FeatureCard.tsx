import Link from "next/link";
import type { ComponentType } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
interface Props { href: string; title: string; description: string; Icon: ComponentType<{ size?: number; className?: string }>; }
export default function FeatureCard({ href, title, description, Icon }: Props) {
  return <Link href={href} className="feature-card group">
    <div className="feature-icon"><Icon size={21} /></div>
    <div className="mt-5 flex items-start justify-between gap-3"><h3 className="font-display text-lg font-extrabold text-slate-950">{title}</h3><IconArrowUpRight size={18} className="mt-1 shrink-0 text-blue-500 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
    <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
  </Link>;
}
