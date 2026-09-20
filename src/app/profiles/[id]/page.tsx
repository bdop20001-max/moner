import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { ProfileActions } from "@/components/profiles/ProfileActions";
import { getMembershipAccess } from "@/lib/membership-access";
import { moreProfilesWhatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "সদস্য প্রোফাইল",
  description: "এই প্রোফাইল দেখতে সক্রিয় Membership প্রয়োজন।",
};

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const access = await getMembershipAccess();
  if (!access.hasActiveMembership || !access.session) {
    redirect(moreProfilesWhatsappLink());
  }
  const session = access.session;

  const member = await prisma.member.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!member || member.status !== "ACTIVE") {
    notFound();
  }

  const isSelf = session.sub === member.id;

  if (!isSelf) {
    await prisma.profileView
      .create({ data: { viewerId: session.sub, viewedId: member.id } })
      .catch(() => {});
  }

  let alreadyLiked = false;
  let alreadySaved = false;
  if (!isSelf) {
    const [like, saved] = await Promise.all([
      prisma.like.findUnique({
        where: { fromId_toId: { fromId: session.sub, toId: member.id } },
      }),
      prisma.savedProfile.findUnique({
        where: { memberId_savedId: { memberId: session.sub, savedId: member.id } },
      }),
    ]);
    alreadyLiked = !!like;
    alreadySaved = !!saved;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-maroon/10 bg-white p-6">
              <Avatar name={member.displayName} colorKey={member.avatarColor} size={160} />
              <div className="flex flex-wrap justify-center gap-1.5">
                {member.verification === "VERIFIED" && (
                  <Badge tone="green">✓ Verified</Badge>
                )}
                {member.isDemo && <Badge tone="neutral">Demo</Badge>}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-brand-maroon-dark">
                {member.displayName}
                <span className="ml-2 text-xl font-medium text-brand-ink/60">
                  {member.age} বছর
                </span>
              </h1>
              <p className="mt-1 text-brand-ink/70">{member.district}</p>
              {member.profession && (
                <p className="mt-1 text-sm text-brand-ink/60">{member.profession}</p>
              )}

              <div className="mt-5">
                <h2 className="text-sm font-semibold text-brand-maroon-dark">পরিচিতি</h2>
                <p className="mt-1 whitespace-pre-line text-sm text-brand-ink/80">
                  {member.bio || "এই সদস্য এখনো পরিচিতি যোগ করেননি।"}
                </p>
              </div>

              {!isSelf ? (
                <ProfileActions
                  memberId={member.id}
                  initialLiked={alreadyLiked}
                  initialSaved={alreadySaved}
                />
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
