import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { MemberAdminPanel } from "@/components/admin/MemberAdminPanel";
import { daysRemaining } from "@/lib/member-utils";

export const dynamic = "force-dynamic";

export default async function AdminMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [member, plans] = await Promise.all([
    prisma.member.findUnique({
      where: { id },
      include: {
        wallet: true,
        memberships: { include: { plan: true }, orderBy: { createdAt: "desc" }, take: 5 },
        transactions: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    }),
    prisma.membershipPlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, price: true },
    }),
  ]);

  if (!member) notFound();

  const activeMembership = member.memberships.find((m) => m.status === "ACTIVE");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={member.displayName} colorKey={member.avatarColor} size={64} />
        <div>
          <h1 className="text-2xl font-extrabold text-brand-maroon-dark">{member.displayName}</h1>
          <p className="text-sm text-brand-ink/60">User ID: {member.userId}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-brand-maroon/10 bg-white p-4">
          <p className="text-xs text-brand-ink/50">ওয়ালেট ব্যালেন্স</p>
          <p className="text-xl font-bold text-brand-maroon-dark">৳{member.wallet?.balance ?? 0}</p>
        </div>
        <div className="rounded-xl border border-brand-maroon/10 bg-white p-4">
          <p className="text-xs text-brand-ink/50">চ্যাট ক্রেডিট</p>
          <p className="text-xl font-bold text-brand-maroon-dark">{member.wallet?.chatCredits ?? 0}</p>
        </div>
        <div className="rounded-xl border border-brand-maroon/10 bg-white p-4">
          <p className="text-xs text-brand-ink/50">সক্রিয় মেম্বারশিপ</p>
          <p className="text-xl font-bold text-brand-maroon-dark">
            {activeMembership ? `${activeMembership.plan.name} (${daysRemaining(activeMembership.expiryDate)} দিন বাকি)` : "নেই"}
          </p>
        </div>
      </div>

      <MemberAdminPanel
        member={{
          id: member.id,
          displayName: member.displayName,
          gender: member.gender,
          age: member.age,
          district: member.district,
          profession: member.profession ?? "",
          bio: member.bio ?? "",
          email: member.email ?? "",
          phone: member.phone ?? "",
          status: member.status,
          verification: member.verification,
          featured: member.featured,
        }}
        plans={plans}
      />

      <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
        <h2 className="font-bold text-brand-maroon-dark">সাম্প্রতিক লেনদেন</h2>
        {member.transactions.length === 0 ? (
          <p className="mt-2 text-sm text-brand-ink/60">কোনো লেনদেন নেই।</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {member.transactions.map((t) => (
              <li key={t.id} className="flex justify-between border-b border-black/5 pb-2">
                <span className="text-brand-ink/70">
                  {t.type} {t.note ? `· ${t.note}` : ""}
                </span>
                <span className="font-semibold">৳{t.amount} / {t.credits} ক্রেডিট</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
