import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { ProfileEditForm } from "@/components/dashboard/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const session = await getSession();
  const member = await prisma.member.findUniqueOrThrow({ where: { id: session!.sub } });

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">প্রোফাইল এডিট</h1>
      <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
        <ProfileEditForm
          initial={{
            displayName: member.displayName,
            district: member.district,
            profession: member.profession ?? "",
            bio: member.bio ?? "",
            email: member.email ?? "",
            phone: member.phone ?? "",
          }}
        />
      </div>
    </div>
  );
}
