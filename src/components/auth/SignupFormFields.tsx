"use client";

import { useState, useId, FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PasswordField from "./PasswordField";

export default function SignupFormFields({ locale, onSuccess }: { locale: string; onSuccess?: () => void }) {
  const t = useTranslations("auth.signup");
  const tc = useTranslations("auth.common");
  const uid = useId();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!username.trim()) next.username = t("usernameRequired");
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = t("emailInvalid");
    if (password.length < 8) next.password = t("passwordTooShort");
    if (confirmPassword !== password) next.confirmPassword = t("passwordMismatch");
    if (!acceptedTerms) next.terms = t("termsRequired");
    setErrors(next);
    if (Object.keys(next).length) return;

    // TODO: POST /api/auth/signup (backend géré à part).
    // Quand la réponse est OK, appeler : onSuccess?.();
  }

  return (
    <>
      <h1 className="font-display text-2xl font-extrabold text-[var(--ink)]">{t("heading")}</h1>
      <p className="mt-1.5 text-sm text-[var(--muted)]">{t("lead")}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
        <div>
          <label htmlFor={`${uid}-username`} className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
            {t("username")}
          </label>
          <input
            id={`${uid}-username`}
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("usernamePlaceholder")}
            className="form-input"
            aria-invalid={!!errors.username}
          />
          {errors.username && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
            {t("email")}
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="form-input"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>}
        </div>

        <PasswordField
          label={t("password")}
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          error={errors.password}
          showLabel={tc("showPassword")}
          hideLabel={tc("hidePassword")}
        />
        <PasswordField
          label={t("confirmPassword")}
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          error={errors.confirmPassword}
          showLabel={tc("showPassword")}
          hideLabel={tc("hidePassword")}
        />

        <label className="checkbox-row text-xs leading-relaxed text-[var(--muted)]">
          <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
          <span>
            {t("termsPrefix")}{" "}
            <Link href={`/${locale}/terms`} className="font-semibold text-[var(--blue)] hover:underline">{t("termsLink")}</Link>{" "}
            {t("termsAnd")}{" "}
            <Link href={`/${locale}/privacy`} className="font-semibold text-[var(--blue)] hover:underline">{t("privacyLink")}</Link>.
          </span>
        </label>
        {errors.terms && <p className="text-xs font-semibold text-red-600">{errors.terms}</p>}

        <button type="submit" className="btn-primary">
          {t("submit")}
        </button>
      </form>
    </>
  );
}