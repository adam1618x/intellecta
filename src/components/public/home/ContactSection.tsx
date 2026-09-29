import Link from "next/link";
import { IconArrowUpRight, IconClockHour4, IconMail, IconMapPin } from "@tabler/icons-react";

interface Props {
  locale: string;
  title: string;
  subtitle: string;
  note: string;
  email: string;
  location: string;
  sessions: string;
  contactLabel: string;
}

export default function ContactSection({ locale, title, subtitle, note, email, location, sessions, contactLabel }: Props) {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-700 to-blue-900 p-8 text-white sm:p-14">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -end-20 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-200">{subtitle}</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-blue-100/85 sm:text-base">{note}</p>
              <Link
                href={`/${locale}/contact`}
                className="group mt-9 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-blue-700 transition hover:-translate-y-0.5"
              >
                {contactLabel}
                <IconArrowUpRight size={17} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
              </Link>
            </div>

            <ul className="divide-y divide-white/15 rounded-2xl border border-white/15 bg-white/[0.07]">
              <Info icon={<IconMail size={18} />} text={email} href={`mailto:${email}`} />
              <Info icon={<IconMapPin size={18} />} text={location} />
              <Info icon={<IconClockHour4 size={18} />} text={sessions} />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const body = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10">{icon}</span>
      <span className="min-w-0 break-words text-sm leading-6 text-white/90">{text}</span>
    </>
  );
  const cls = "flex items-center gap-4 p-5";
  return (
    <li>
      {href ? <a href={href} className={`${cls} transition hover:bg-white/10`}>{body}</a> : <div className={cls}>{body}</div>}
    </li>
  );
}