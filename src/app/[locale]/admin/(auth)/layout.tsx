import type { ReactNode } from "react";

// Layout for the (auth) route group — currently just /admin/login.
// Intentionally has no Sidebar: the login screen renders full-bleed.
export default function AuthLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}