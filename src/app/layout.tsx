// src/app/layout.tsx
// This root layout is intentionally minimal — the real <html> and <body>
// are rendered by src/app/[locale]/layout.tsx which knows the locale,
// lang, and dir attributes. Duplicating them here causes a hydration mismatch.
import "./globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}