import type { ReactNode } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
export default function PublicLayout({children}:{children:ReactNode}){return <div className="min-h-screen bg-cream"><Navbar/><main>{children}</main><Footer/></div>}
