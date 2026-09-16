import Link from "next/link";
import { ReactNode } from "react";
interface ButtonProps { href: string; children: ReactNode; icon?: ReactNode; variant?: "primary" | "secondary"; className?: string; }
export default function Button({ href, children, icon, variant = "primary", className = "" }: ButtonProps) {
  const base = "group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-extrabold transition-all duration-300 active:scale-[.98]";
  const variants = { primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25", secondary: "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50" };
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}{children}</Link>;
}
