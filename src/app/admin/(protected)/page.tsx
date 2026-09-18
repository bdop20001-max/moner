import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalMembers,
    activeMembers,
    femaleMembers,
    maleMembers,
    activeMemberships,
    pendingReports,
    verifiedMembers,
    rechargeSum,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: "ACTIVE" } }),
    prisma.member.count({ where: { gender: "FEMALE" } }),
    prisma.member.count({ where: { gender: "MALE" } }),
    prisma.membership.count({ where: { status: "ACTIVE" } }),
    prisma.report.count({ where: { status: "OPEN" } }),
    prisma.member.count({ where: { verification: "VERIFIED" } }),
    prisma.walletTransaction.aggregate({
      where: { type: "RECHARGE" },
      _sum: { amount: true },
    }),
  ]);

  const cards = [
    { label: "মোট সদস্য", value: totalMembers, href: "/admin/members" },
    { label: "সক্রিয় সদস্য", value: activeMembers, href: "/admin/members?status=ACTIVE" },
    { label: "নারী সদস্য", value: femaleMembers, href: "/admin/members?gender=FEMALE" },
    { label: "পুরুষ সদস্য", value: maleMembers, href: "/admin/members?gender=MALE" },
    { label: "সক্রিয় মেম্বারশিপ", value: activeMemberships, href: "/admin/members" },
    { label: "ভেরিফাইড সদস্য", value: verifiedMembers, href: "/admin/members" },
    { label: "অমীমাংসিত রিপোর্ট", value: pendingReports, href: "/admin/reports" },
    { label: "মোট রিচার্জ (৳)", value: rechargeSum._sum.amount ?? 0, href: "/admin/payments" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">ড্যাশবোর্ড</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-brand-maroon/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-2xl font-extrabold text-brand-maroon-dark">{c.value}</p>
            <p className="mt-1 text-sm text-brand-ink/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/members/new"
          className="rounded-full bg-brand-maroon px-5 py-2.5 text-sm font-semibold text-brand-cream"
        >
          + নতুন সদস্য তৈরি করুন
        </Link>
        <Link
          href="/admin/plans/new"
          className="rounded-full border border-brand-maroon px-5 py-2.5 text-sm font-semibold text-brand-maroon"
        >
          + নতুন প্ল্যান
        </Link>
      </div>
    </div>
  );
}
