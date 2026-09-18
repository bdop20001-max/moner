import Link from "next/link";
import { ProfileCard, type ProfileCardData } from "@/components/profiles/ProfileCard";

export function FeaturedProfiles({ profiles }: { profiles: ProfileCardData[] }) {
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
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/profiles"
          className="inline-flex items-center justify-center rounded-full border border-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-maroon hover:bg-brand-maroon/5"
        >
          সব প্রোফাইল দেখুন
        </Link>
      </div>
    </section>
  );
}
