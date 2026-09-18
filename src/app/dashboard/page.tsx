import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  daysRemaining,
  maskEmail,
  maskPhone,
  profileCompletionPercent,
} from "@/lib/member-utils";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const session = await getSession();
  const memberId = session!.sub;

  const [member, wallet, activeMembership, likesReceived, viewCount, connRequests, messageCount, savedCount, unreadNotifications] =
    await Promise.all([
      prisma.member.findUniqueOrThrow({
        where: { id: memberId },
        include: { photos: true },
      }),
      prisma.wallet.findUnique({ where: { memberId } }),
      prisma.membership.findFirst({
        where: { memberId, status: "ACTIVE" },
        include: { plan: true },
        orderBy: { expiryDate: "desc" },
      }),
      prisma.like.count({ where: { toId: memberId } }),
      prisma.profileView.count({ where: { viewedId: memberId } }),
      prisma.connectionRequest.count({ where: { toId: memberId, status: "PENDING" } }),
      prisma.message.count({ where: { receiverId: memberId } }),
      prisma.savedProfile.count({ where: { memberId } }),
      prisma.notification.count({ where: { memberId, read: false } }),
    ]);

  const completion = profileCompletionPercent(member);
  const remaining = activeMembership ? daysRemaining(activeMembership.expiryDate) : 0;

  const stats = [
    { label: "প্রোফাইল ভিউ", value: viewCount },
    { label: "পছন্দ (Likes)", value: likesReceived },
    { label: "কানেকশন রিকোয়েস্ট", value: connRequests },
    { label: "বার্তা", value: messageCount },
    { label: "সংরক্ষিত প্রোফাইল", value: savedCount },
    { label: "অপঠিত নোটিফিকেশন", value: unreadNotifications },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-2xl border border-brand-maroon/10 bg-white p-6 sm:flex-row sm:items-center">
        <Avatar name={member.displayName} colorKey={member.avatarColor} size={88} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-brand-maroon-dark">
              {member.displayName}
            </h1>
            <Badge tone={member.status === "ACTIVE" ? "green" : "rose"}>
              {member.status === "ACTIVE" ? "Active" : member.status === "INACTIVE" ? "Inactive" : "Suspended"}
            </Badge>
            {member.verification === "VERIFIED" && <Badge tone="gold">✓ Verified</Badge>}
          </div>
          <p className="mt-1 text-sm text-brand-ink/60">ইউজার আইডি: {member.userId}</p>
          <p className="text-sm text-brand-ink/60">ইমেইল: {maskEmail(member.email)}</p>
          <p className="text-sm text-brand-ink/60">ফোন: {maskPhone(member.phone)}</p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-brand-ink/60">
              <span>প্রোফাইল সম্পূর্ণতা</span>
              <span>{completion}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-brand-rose"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
          <h2 className="font-bold text-brand-maroon-dark">ওয়ালেট</h2>
          <p className="mt-2 text-3xl font-extrabold text-brand-maroon-dark">
            ৳{wallet?.balance ?? 0}
          </p>
          <p className="text-sm text-brand-ink/60">
            চ্যাট/কানেকশন ক্রেডিট: {wallet?.chatCredits ?? 0}
          </p>
          <Link
            href="/dashboard/wallet"
            className="mt-4 inline-flex rounded-full bg-brand-maroon px-4 py-2 text-sm font-semibold text-brand-cream"
          >
            Wallet Recharge
          </Link>
        </div>

        <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
          <h2 className="font-bold text-brand-maroon-dark">মেম্বারশিপ</h2>
          {activeMembership ? (
            <>
              <p className="mt-2 text-lg font-bold text-brand-maroon-dark">
                {activeMembership.plan.name}
              </p>
              <p className="text-sm text-brand-ink/60">
                শুরু: {activeMembership.startDate.toLocaleDateString("bn-BD")}
              </p>
              <p className="text-sm text-brand-ink/60">
                মেয়াদ শেষ: {activeMembership.expiryDate.toLocaleDateString("bn-BD")}
              </p>
              <p className="text-sm font-semibold text-brand-rose">
                বাকি আছে {remaining} দিন
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-brand-ink/60">
              বর্তমানে কোনো সক্রিয় মেম্বারশিপ নেই।
            </p>
          )}
          <Link
            href="/dashboard/membership"
            className="mt-4 inline-flex rounded-full bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-maroon-dark"
          >
            Membership Renew
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-brand-maroon/10 bg-white p-4 text-center"
          >
            <p className="text-2xl font-extrabold text-brand-maroon-dark">{s.value}</p>
            <p className="mt-1 text-xs text-brand-ink/60">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/profile"
          className="rounded-full border border-brand-maroon px-5 py-2 text-sm font-semibold text-brand-maroon"
        >
          Edit Profile
        </Link>
        <Link
          href="/dashboard/settings"
          className="rounded-full border border-brand-maroon px-5 py-2 text-sm font-semibold text-brand-maroon"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
