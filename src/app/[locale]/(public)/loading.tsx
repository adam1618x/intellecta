// Shown instantly by Next.js the moment a navigation to any page inside
// the (public) route group starts, while the destination page's server
// data (Prisma queries, translations, etc.) is still being fetched.
// Without this file the router shows nothing at all until the full page
// is ready, which is what reads as a "delay" when moving between pages.
export default function PublicLoading() {
    return (
        <div className="min-h-[60vh] w-full animate-pulse px-4 sm:px-6 py-12">
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
    );
}
