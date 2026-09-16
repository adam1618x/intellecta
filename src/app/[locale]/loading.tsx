// Shown the instant a navigation changes the `[locale]` param itself
// (e.g. switching languages), while LocaleLayout re-resolves (await
// getMessages() for the new locale) and everything below it re-renders.
//
// Without this file, there is no Suspense boundary above (public)/loading.tsx
// that can catch a change at this level — [locale]/layout.tsx renders
// <html>/<body> and sits at the very top of the tree, so nothing shows
// until its own work (and everything below) is fully ready. That's the
// "delay with no skeleton" during language switches.
//
// Kept intentionally generic (no Navbar/Footer chrome) since it also
// covers first loads under /admin, not just the public site.
export default function LocaleLoading() {
    return (
        <div className="min-h-screen w-full flex flex-col animate-pulse">
            <div className="h-16 w-full" style={{ background: "rgba(255, 255, 255, 0.92)" }} />
            <div className="flex-1 px-4 sm:px-6 py-12">
                <div className="mx-auto max-w-5xl">
                    <div className="mx-auto mb-4 h-3 w-40 rounded-full bg-black/10" />
                    <div className="mx-auto mb-8 h-7 w-2/3 rounded-full bg-black/10" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-border/60 bg-black/[0.03] p-5"
                            >
                                <div className="mb-3 h-4 w-3/4 rounded-full bg-black/10" />
                                <div className="mb-2 h-3 w-full rounded-full bg-black/10" />
                                <div className="mb-2 h-3 w-5/6 rounded-full bg-black/10" />
                                <div className="h-3 w-1/2 rounded-full bg-black/10" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
