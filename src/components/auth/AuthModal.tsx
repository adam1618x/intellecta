"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import AuthCard from "./AuthCard";
import ParticleNetwork from "./ParticleNetwork";
import { useAuthModal } from "./AuthModalContext";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Éléments réellement atteignables : ni cachés (display:none), ni dans une zone [inert]
function getFocusable(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest("[inert]") && el.offsetParent !== null,
  );
}

export default function AuthModal() {
  const { isOpen } = useAuthModal();
  if (!isOpen) return null;
  return createPortal(<AuthModalContent />, document.body);
}

function AuthModalContent() {
  const t = useTranslations("auth.common");
  const { mode, setMode, closeAuthModal, completeAuth } = useAuthModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  // 1) Bloque le scroll de la page + rend le focus au bouton d'origine à la fermeture
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // 2) Échap pour fermer + focus piégé dans le modal (Tab / Shift+Tab)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeAuthModal();
        return;
      }
      const root = dialogRef.current;
      if (e.key !== "Tab" || !root) return;

      const items = getFocusable(root);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !root.contains(active);

      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeAuthModal]);

  // 3) Focus à l'ouverture et à chaque changement de mode
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const root = dialogRef.current;
      if (!root) return;
      // Sur écran tactile on évite d'ouvrir le clavier tout de suite
      if (!window.matchMedia("(pointer: fine)").matches) {
        root.focus();
        return;
      }
      (getFocusable(root).find((el) => el.tagName === "INPUT") ?? root).focus();
    });
    return () => cancelAnimationFrame(id);
  }, [mode]);

  return (
    <div className="auth-modal-backdrop">
      {/* Neurones : au-dessus du flou, sous la carte */}
      <ParticleNetwork />

      <div
        className="auth-modal-scroll"
        onMouseDown={(e) => {
          // clic sur le fond (pas dans la carte) = fermer
          if (e.target === e.currentTarget) closeAuthModal();
        }}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("dialogLabel")}
          tabIndex={-1}
          className="auth-modal-dialog"
        >
          <button type="button" onClick={closeAuthModal} aria-label={t("close")} className="auth-modal-close">
            <IconX size={18} />
          </button>
          <AuthCard mode={mode} onModeChange={setMode} onSuccess={completeAuth} />
        </div>
      </div>
    </div>
  );
}   