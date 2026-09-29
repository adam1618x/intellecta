"use client";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconSend,
  IconWorld,
} from "@tabler/icons-react";
const SUBJECTS = ["tariqa", "ilmi", "wird", "other"] as const;
export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
      locale,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };
  const items = [
    [IconMail, t("email")],
    [IconMapPin, t("location")],
    [IconWorld, t("sessions")],
  ] as const;
  return (
    <div>
      <header className="page-hero">
        <div className="page-hero-inner">
          <span className="eyebrow eyebrow-white">
            <IconMessageCircle size={14} />
            {t("subtitle")}
          </span>
          <h1 className="mt-5">{t("title")}</h1>
          <p>{t("note")}</p>
        </div>
      </header>
      <main className="section-shell section-pad">
        <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <aside className="info-card">
            <span className="section-kicker">{t("infoTitle")}</span>
            <h2 className="mt-3 font-display text-2xl font-extrabold text-slate-950">
              {t("infoTitle")}
            </h2>
            <div className="mt-7 grid gap-3">
              {items.map(([Icon, text]) => (
                <div key={text} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </aside>
          <section className="info-card">
            {status === "sent" ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <IconCheck size={30} />
                </div>
                <h2 className="mt-6 font-display text-2xl font-extrabold text-slate-950">
                  {t("sent")}
                </h2>
                <p className="mt-2 text-sm text-slate-500">{t("sentSub")}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t("form.name")}>
                    <input
                      name="name"
                      required
                      placeholder={t("form.namePh")}
                      className="form-input"
                    />
                  </Field>
                  <Field label={t("form.email")}>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="form-input"
                      dir="ltr"
                    />
                  </Field>
                </div>
                <Field label={t("form.subject")}>
                  <select name="subject" required className="form-input">
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {t(`form.subjects.${s}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t("form.message")}>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    placeholder={t("form.messagePh")}
                    className="form-input resize-y"
                  />
                </Field>
                {status === "error" && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <IconAlertCircle size={17} />
                    {t("error")}
                  </div>
                )}
                <button
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <IconSend size={17} />
                  {status === "sending" ? t("sending") : t("form.send")}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
        {label}
      </span>
      {children}
    </label>
  );
}
