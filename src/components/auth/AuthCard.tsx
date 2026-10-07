"use client";

import { useParams } from "next/navigation";
import { IconSparkles } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import LoginFormFields from "./LoginFormFields";
import SignupFormFields from "./SignupFormFields";
import type { AuthMode } from "./AuthModalContext";

interface AuthCardProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

export default function AuthCard({ mode, onModeChange, onSuccess }: AuthCardProps) {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("auth.overlay");

  // `inert` : la partie invisible ne reçoit plus le focus clavier ni les lecteurs d'écran
  return (
    <>
      {/* Desktop : carte coulissante */}
      <div className="auth-card" data-mode={mode}>
        <div className="auth-form auth-sign-in" inert={mode === "signup"}>
          <LoginFormFields locale={locale} onSuccess={onSuccess} />
        </div>

        <div className="auth-form auth-sign-up" inert={mode === "login"}>
          <SignupFormFields locale={locale} onSuccess={onSuccess} />
        </div>

        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left" inert={mode === "login"}>
              <div className="auth-overlay-icon"><IconSparkles size={22} /></div>
              <h2 className="font-display text-xl font-extrabold">{t("loginTitle")}</h2>
              <p className="mt-2 text-sm text-white/75">{t("loginLead")}</p>
              <button type="button" onClick={() => onModeChange("login")} className="auth-ghost-btn mt-6">
                {t("loginButton")}
              </button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right" inert={mode === "signup"}>
              <div className="auth-overlay-icon"><IconSparkles size={22} /></div>
              <h2 className="font-display text-xl font-extrabold">{t("signupTitle")}</h2>
              <p className="mt-2 text-sm text-white/75">{t("signupLead")}</p>
              <button type="button" onClick={() => onModeChange("signup")} className="auth-ghost-btn mt-6">
                {t("signupButton")}
              </button>
            </div>
          </div>

          <div className="auth-vapor" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
        </div>
      </div>

      {/* Mobile : carte empilée, sans glissement */}
      <div className="auth-card-mobile">
        {mode === "login" ? (
          <>
            <LoginFormFields locale={locale} onSuccess={onSuccess} />
            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              {t("signupTitle")}{" "}
              <button type="button" onClick={() => onModeChange("signup")} className="font-semibold text-[var(--blue)] hover:underline">
                {t("signupButton")}
              </button>
            </p>
          </>
        ) : (
          <>
            <SignupFormFields locale={locale} onSuccess={onSuccess} />
            <p className="mt-6 text-center text-sm text-[var(--muted)]">
              {t("loginTitle")}{" "}
              <button type="button" onClick={() => onModeChange("login")} className="font-semibold text-[var(--blue)] hover:underline">
                {t("loginButton")}
              </button>
            </p>
          </>
        )}
      </div>
    </>
  );
}