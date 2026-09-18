import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { ProfileActions } from "@/components/profiles/ProfileActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id },
    select: { displayName: true, district: true },
  });
  if (!member) return { title: "প্রোফাইল পাওয়া যায়নি" };
  return { title: `${member.displayName} · ${member.district}` };
}

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  const member = await prisma.member.findUnique({
    where: { id },
    include: { photos: true },
  });

  if (!member || member.status !== "ACTIVE") {
    notFound();
  }

  const isMember = session?.role === "MEMBER";
  const isSelf = session?.role === "MEMBER" && session.sub === member.id;

  if (isMember && !isSelf) {
    await prisma.profileView
      .create({ data: { viewerId: session!.sub, viewedId: member.id } })
      .catch(() => {});
  }

  let alreadyLiked = false;
  let alreadySaved = false;
  if (isMember && !isSelf) {
    const [like, saved] = await Promise.all([
      prisma.like.findUnique({
        where: { fromId_toId: { fromId: session!.sub, toId: member.id } },
      }),
      prisma.savedProfile.findUnique({
        where: { memberId_savedId: { memberId: session!.sub, savedId: member.id } },
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
              {!isMember && (
                <p className="text-center text-xs text-brand-ink/50">
                  সম্পূর্ণ ছবি ও যোগাযোগের সুবিধা দেখতে লগইন করুন।
                </p>
              )}
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
                  {member.bio
                    ? isMember || isSelf
                      ? member.bio
                      : `${member.bio.slice(0, 120)}${member.bio.length > 120 ? "…" : ""}`
                    : "এই সদস্য এখনো পরিচিতি যোগ করেননি।"}
                </p>
              </div>

              {isMember && !isSelf ? (
                <ProfileActions
                  memberId={member.id}
                  initialLiked={alreadyLiked}
                  initialSaved={alreadySaved}
                />
              ) : !isMember ? (
                <div className="mt-8 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-5">
                  <p className="text-sm text-brand-maroon-dark">
                    Like, Save, বার্তা পাঠানো এবং পূর্ণ প্রোফাইল দেখতে সদস্য
                    লগইন করুন।
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link
                      href="/login"
                      className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream"
                    >
                      লগইন
                    </Link>
                    <Link
                      href="/membership"
                      className="rounded-full border border-brand-maroon px-5 py-2 text-sm font-semibold text-brand-maroon"
                    >
                      মেম্বারশিপ নিন
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
