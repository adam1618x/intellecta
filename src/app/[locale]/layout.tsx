import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const SUPPORTED_LOCALES = ["ar", "en", "fr", "ms"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    const titles: Record<string, string> = {
        ar: "منصة إنتلكتا",
        en: "Intellecta",
        fr: "Intellecta",
        ms: "Intellecta",
    };

    const descs: Record<string, string> = {
        ar: "إنتلكتا — تعلّم. طبّق. تقدّم.",
        en: "Intellecta — Learn. Practice. Progress.",
        fr: "Intellecta — Apprendre. Pratiquer. Progresser.",
        ms: "Intellecta — Belajar. Berlatih. Maju.",
    };

    return {
        title: titles[locale] ?? titles.ar,
        description: descs[locale] ?? descs.ar,
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!SUPPORTED_LOCALES.includes(locale as Locale)) notFound();

    const messages = await getMessages();

    return (
        <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-scroll-behavior="smooth">
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}