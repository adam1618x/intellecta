"use client";
import Link from "next/link";
import { IconArrowUpRight, IconBook2 } from "@tabler/icons-react";
import { CATEGORIES } from "@/types";
import CourseCard from "@/components/ui/CourseCard";
interface Props { locale: string; latestTitle: string; viewAll: string; emptyLabel: string; categoryLabels: Record<string,string>; publications: Array<{id:number; category:string; title:string|null; excerpt:string|null}>; }
export default function LatestCoursesSection({locale,latestTitle,viewAll,emptyLabel,categoryLabels,publications}:Props){
 return <section className="section-pad bg-white"><div className="section-shell">
   <div className="section-heading-row"><div><span className="section-kicker"><IconBook2 size={14}/>{latestTitle}</span><h2 className="section-title">{latestTitle}</h2></div><Link href={`/${locale}/courses/courses`} className="text-link">{viewAll}<IconArrowUpRight size={16}/></Link></div>
   {publications.length===0 ? <div className="empty-state">{emptyLabel}</div> : <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{publications.map(pub=>{const cat=CATEGORIES.find(c=>c.key===pub.category); if(!cat)return null; return <CourseCard key={pub.id} href={`/${locale}/courses/${cat.slug}/${pub.id}`} title={pub.title??"—"} excerpt={pub.excerpt??""} categoryKey={pub.category} categoryLabel={categoryLabels[pub.category]??pub.category}/>})}</div>}
 </div></section>;
}
