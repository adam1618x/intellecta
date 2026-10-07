"use client";

import { createContext, useContext } from "react";

export type AuthMode = "login" | "signup";

export interface AuthModalContextValue {
  isOpen: boolean;
  mode: AuthMode;
  /** Ouvre le modal. `onSuccess` est exécuté après une connexion réussie (ex: "Acheter le cours"). */
  openAuthModal: (mode?: AuthMode, onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  setMode: (mode: AuthMode) => void;
  /** À appeler quand le login/signup a réussi : ferme le modal puis lance `onSuccess`. */
  completeAuth: () => void;
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal doit être utilisé dans <AuthModalProvider>");
  return ctx;
}