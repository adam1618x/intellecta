"use client";

import { useState, useId, FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PasswordField from "./PasswordField";

export default function LoginFormFields({ locale, onSuccess }: { locale: string; onSuccess?: () => void }) {
  const t = useTranslations("auth.login");
  const tc = useTranslations("auth.common");
  const uid = useId();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = t("usernameRequired");
    if (!password) next.password = t("passwordRequired");
    setErrors(next);
    if (Object.keys(next).length) return;
    
    // TODO: POST /api/auth/login once feat/20-auth-user-model is merged.
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

        <PasswordField
          label={t("password")}
          value={password}
          onChange={setPassword}
          error={errors.password}
          showLabel={tc("showPassword")}
          hideLabel={tc("hidePassword")}
        />

        <div className="flex justify-end">
          <Link href={`/${locale}/forgot-password`} className="text-xs font-semibold text-[var(--blue)] hover:underline">
            {t("forgotPassword")}
          </Link>
        </div>

        <button type="submit" className="btn-primary">
          {t("submit")}
        </button>
      </form>
    </>
  );
}