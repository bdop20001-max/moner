import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { daysRemaining } from "@/lib/member-utils";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function MembershipRenewPage() {
  const session = await getSession();
  const memberId = session!.sub;

  const [member, activeMembership, plans] = await Promise.all([
    prisma.member.findUniqueOrThrow({ where: { id: memberId } }),
    prisma.membership.findFirst({
      where: { memberId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { expiryDate: "desc" },
    }),
    prisma.membershipPlan.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">মেম্বারশিপ</h1>

      <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
        {activeMembership ? (
          <>
            <p className="text-sm text-brand-ink/60">বর্তমান প্ল্যান</p>
            <p className="text-xl font-bold text-brand-maroon-dark">
              {activeMembership.plan.name}
            </p>
            <p className="mt-1 text-sm text-brand-ink/60">
              মেয়াদ শেষ: {activeMembership.expiryDate.toLocaleDateString("bn-BD")} (বাকি{" "}
              {daysRemaining(activeMembership.expiryDate)} দিন)
            </p>
          </>
        ) : (
          <p className="text-sm text-brand-ink/60">বর্তমানে কোনো সক্রিয় মেম্বারশিপ নেই।</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-brand-maroon/10 bg-white p-5">
            <h3 className="font-bold text-brand-maroon-dark">{plan.name}</h3>
            <p className="mt-1 text-2xl font-extrabold text-brand-maroon-dark">৳{plan.price}</p>
            <p className="text-sm text-brand-ink/60">{plan.durationDays} দিন · {plan.chatCredits} ক্রেডিট</p>
            <a
              href={whatsappLink(
                `আসসালামু আলাইকুম, আমার User ID ${member.userId}। আমি ${plan.name} প্ল্যানে মেম্বারশিপ রিনিউ করতে চাই।`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1ebe57]"
            >
              WhatsApp-এ রিনিউ করুন
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
