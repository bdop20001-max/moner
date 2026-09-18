import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { ReportStatusSelect } from "@/components/admin/ReportStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      reporter: { select: { displayName: true, userId: true } },
      reported: { select: { displayName: true, userId: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">রিপোর্ট ও অভিযোগ</h1>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="rounded-2xl border border-brand-maroon/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm">
                <span className="font-semibold text-brand-ink">{r.reporter.displayName}</span>
                <span className="text-brand-ink/50"> রিপোর্ট করেছেন </span>
                <span className="font-semibold text-brand-ink">{r.reported.displayName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={r.status === "OPEN" ? "rose" : r.status === "RESOLVED" ? "green" : "neutral"}>
                  {r.status}
                </Badge>
                <ReportStatusSelect reportId={r.id} status={r.status} />
              </div>
            </div>
            <p className="mt-2 text-sm text-brand-ink/80">কারণ: {r.reason}</p>
            {r.details && <p className="mt-1 text-sm text-brand-ink/60">{r.details}</p>}
            <p className="mt-2 text-xs text-brand-ink/40">{r.createdAt.toLocaleString("bn-BD")}</p>
          </div>
        ))}
        {reports.length === 0 && <p className="text-sm text-brand-ink/60">কোনো রিপোর্ট নেই।</p>}
      </div>
    </div>
  );
}
