import type { ReactNode } from "react";
import Sidebar from "@/components/admin/Sidebar";

// Layout for the (dashboard) route group — every admin page that should show
// the sidebar (dashboard, contact, publications, about-page, ...)
export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "var(--cream)", fontFamily: "var(--font-arabic-body)" }}>
            <Sidebar />
            {/* pt-14 on mobile to clear the fixed hamburger button */}
            <main className="flex-1 flex flex-col overflow-auto pt-14 md:pt-0">
                {children}
            </main>
        </div>
    );
}
