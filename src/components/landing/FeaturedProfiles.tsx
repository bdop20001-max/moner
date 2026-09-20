import Link from "next/link";
import { ProfileCard, type ProfileCardData } from "@/components/profiles/ProfileCard";
import { moreProfilesWhatsappLink } from "@/lib/whatsapp";

export function FeaturedProfiles({
  profiles,
  canViewFullProfiles,
}: {
  profiles: ProfileCardData[];
  canViewFullProfiles: boolean;
}) {
  return (
    <section id="featured-profiles" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-brand-maroon-dark">
          বাছাই করা প্রোফাইল
        </h2>
        <p className="mt-2 text-brand-ink/70">
          আমাদের কিছু ভেরিফাইড সদস্যদের সাথে পরিচিত হন
        </p>
      </div>

      {profiles.length === 0 ? (
        <p className="text-center text-brand-ink/60">
          এই মুহূর্তে কোনো বাছাইকৃত প্রোফাইল নেই। শীঘ্রই আবার দেখুন।
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} canViewFullProfile={canViewFullProfiles} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        {canViewFullProfiles ? (
          <Link href="/profiles" className="inline-flex items-center justify-center rounded-full border border-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-maroon hover:bg-brand-maroon/5">
            আরও প্রোফাইল দেখুন
          </Link>
        ) : (
          <a href={moreProfilesWhatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1fbd5a]">
            WhatsApp-এ আরও প্রোফাইল দেখুন
          </a>
        )}
      </div>
    </section>
  );
}
