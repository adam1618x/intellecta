import Link from "next/link";
import { IconArrowUpRight, IconMail, IconWorld } from "@tabler/icons-react";
interface Props { locale:string; title:string; subtitle:string; note:string; email:string; location:string; sessions:string; contactLabel:string; }
export default function ContactSection({locale,title,subtitle,note,email,location,sessions,contactLabel}:Props){return <section className="section-pad"><div className="section-shell"><div className="contact-banner">
 <div className="relative z-10 max-w-2xl"><span className="eyebrow eyebrow-white"><IconMail size={14}/>{subtitle}</span><h2 className="mt-5 font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">{title}</h2><p className="mt-4 text-sm leading-7 text-blue-100/85 sm:text-base">{note}</p><Link href={`/${locale}/contact`} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-blue-700 transition hover:-translate-y-0.5">{contactLabel}<IconArrowUpRight size={17}/></Link></div>
 <div className="relative z-10 grid gap-3 sm:grid-cols-3 lg:w-[48%]
 "><Info icon={<IconMail/>} text={email}/><Info icon={<IconWorld/>} text={location}/><Info icon={<IconWorld/>} text={sessions}/></div>
 </div></div></section>}
function Info({icon,text}:{icon:React.ReactNode;text:string}){return <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"><span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">{icon}</span><p className="text-xs leading-5 text-white/80">{text}</p></div>}
