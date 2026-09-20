import { prisma } from "@/lib/db";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { getMembershipAccess } from "@/lib/membership-access";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SavedProfilesPage() {
  const access = await getMembershipAccess();
  if (!access.hasActiveMembership || !access.session) redirect("/membership");
  const session = access.session;

  const saved = await prisma.savedProfile.findMany({
    where: { memberId: session!.sub },
    orderBy: { createdAt: "desc" },
    include: {
      saved: {
        select: {
          id: true,
          displayName: true,
          age: true,
          district: true,
          profession: true,
          verification: true,
          avatarColor: true,
          isDemo: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">সংরক্ষিত প্রোফাইল</h1>

      {saved.length === 0 ? (
        <p className="text-sm text-brand-ink/60">আপনি এখনো কোনো প্রোফাইল সংরক্ষণ করেননি।</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map((s) => (
            <ProfileCard key={s.id} profile={s.saved} canViewFullProfile />
          ))}
        </div>
      )}
    </div>
  );
}
