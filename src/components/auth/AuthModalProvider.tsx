"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { AuthModalContext, type AuthMode } from "./AuthModalContext";

export default function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const pendingRef = useRef<(() => void) | null>(null);

  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  const openAuthModal = useCallback((m: AuthMode = "login", onSuccess?: () => void) => {
    pendingRef.current = onSuccess ?? null;
    setMode(m);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    pendingRef.current = null;
    setIsOpen(false);
  }, []);

  const completeAuth = useCallback(() => {
    const callback = pendingRef.current;
    pendingRef.current = null;
    setIsOpen(false);
    callback?.();
  }, []);

  const value = useMemo(
    () => ({ isOpen, mode, openAuthModal, closeAuthModal, setMode, completeAuth }),
    [isOpen, mode, openAuthModal, closeAuthModal, completeAuth],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal />
    </AuthModalContext.Provider>
  );
}