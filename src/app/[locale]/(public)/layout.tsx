import type { ReactNode } from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import AuthModalProvider from "@/components/auth/AuthModalProvider";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-cream">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </AuthModalProvider>
  );
}