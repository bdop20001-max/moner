import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminPlansPage() {
  const plans = await prisma.membershipPlan.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-maroon-dark">মেম্বারশিপ প্ল্যান</h1>
        <Link href="/admin/plans/new" className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream">
          + নতুন প্ল্যান
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            href={`/admin/plans/${plan.id}`}
            className="rounded-2xl border border-brand-maroon/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-brand-maroon-dark">{plan.name}</h2>
              <Badge tone={plan.active ? "green" : "neutral"}>{plan.active ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-brand-maroon-dark">৳{plan.price}</p>
            <p className="text-sm text-brand-ink/60">{plan.durationDays} দিন · {plan.chatCredits} ক্রেডিট</p>
          </Link>
        ))}
      </div>
      {plans.length === 0 && <p className="text-sm text-brand-ink/60">কোনো প্ল্যান তৈরি করা হয়নি।</p>}
    </div>
  );
}
