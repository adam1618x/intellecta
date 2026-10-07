"use client";

import { useId, useState } from "react";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  error?: string;
  showLabel?: string;
  hideLabel?: string;
}

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete = "current-password",
  error,
  showLabel = "Show password",
  hideLabel = "Hide password",
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
        {label}
      </label>
      <div className="relative">
        <IconLock size={16} className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          type={visible ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="form-input"
          style={{ paddingInlineStart: "2.75rem", paddingInlineEnd: "2.75rem" }}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute end-1.5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[var(--blue)]"
          aria-label={visible ? hideLabel : showLabel}
          tabIndex={-1}
        >
          {visible ? <IconEyeOff size={17} /> : <IconEye size={17} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}