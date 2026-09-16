import type { ReactNode } from "react";

// Shared shell for everything under /admin. Route groups below — (auth) and
// (dashboard) — each provide their own layout (sidebar or not), so this file
// stays a plain pass-through with no routing/conditional logic.
export default function AdminLayout({ children }: { children: ReactNode }) {
    return children;
}