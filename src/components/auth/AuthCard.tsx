"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { IconSparkles } from "@tabler/icons-react";
import LoginFormFields from "./LoginFormFields";
import SignupFormFields from "./SignupFormFields";
import ParticleNetwork from "./ParticleNetwork";
import { useTranslations } from "next-intl";


export default function AuthCard({ initialMode }: { initialMode: "login" | "signup" }) {
    const { locale } = useParams<{ locale: string }>();
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const t = useTranslations("auth.overlay");


    return (
        <div className="auth-wrap">
            <ParticleNetwork />

            {/* Desktop: sliding card */}
            <div className="auth-card" data-mode={mode}>
                <div className="auth-form auth-sign-in">
                    <LoginFormFields locale={locale} />
                </div>

                <div className="auth-form auth-sign-up">
                    <SignupFormFields locale={locale} />
                </div>

                <div className="auth-overlay-container">
                    <div className="auth-overlay">
                        <div className="auth-overlay-panel auth-overlay-left">
                            <div className="auth-overlay-icon"><IconSparkles size={22} /></div>
                            <h2 className="font-display text-xl font-extrabold">{t("loginTitle")}</h2>
                            <p className="mt-2 text-sm text-white/75">{t("loginLead")}</p>
                            <button type="button" onClick={() => setMode("login")} className="auth-ghost-btn mt-6">
                                {t("loginButton")}
                            </button>
                        </div>
                        <div className="auth-overlay-panel auth-overlay-right">
                            <div className="auth-overlay-icon"><IconSparkles size={22} /></div>
                            <h2 className="font-display text-xl font-extrabold">{t("signupTitle")}</h2>
                            <p className="mt-2 text-sm text-white/75">{t("signupLead")}</p>
                            <button type="button" onClick={() => setMode("signup")} className="auth-ghost-btn mt-6">
                                {t("signupButton")}
                            </button>
                        </div>
                    </div>

                    <div className="auth-vapor" aria-hidden="true">
                        <span /><span /><span /><span />
                    </div>
                </div>
            </div>

            {/* Mobile: stacked card, no slide */}
            <div className="auth-card-mobile">
                {mode === "login" ? (
                    <>
                        <LoginFormFields locale={locale} />
                        <p className="mt-6 text-center text-sm text-[var(--muted)]">
                            {t("signupTitle")}{" "}
                            <button type="button" onClick={() => setMode("signup")} className="font-semibold text-[var(--blue)] hover:underline">
                                {t("signupButton")}
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <SignupFormFields locale={locale} />
                        <p className="mt-6 text-center text-sm text-[var(--muted)]">
                            {t("loginTitle")}{" "}
                            <button type="button" onClick={() => setMode("login")} className="font-semibold text-[var(--blue)] hover:underline">
                                {t("loginButton")}
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}