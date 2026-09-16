// Shown instantly while navigating between admin dashboard pages
// (dashboard, publications, books, contact) so the sidebar/shell stays
// interactive and the user gets immediate feedback instead of a frozen
// screen while the next page's data loads.
export default function DashboardLoading() {
    return (
        <div className="animate-pulse p-8">
            <div className="mb-6 h-7 w-56 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-14 w-full rounded-lg"
                        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    />
                ))}
            </div>
        </div>
    );
}
