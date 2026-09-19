import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { DistrictFilter } from "@/components/profiles/DistrictFilter";
import { getDistrictList, getPublicProfiles } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "প্রোফাইল",
  description: "মনের মানুষের ভেরিফাইড সদস্যদের প্রোফাইল দেখুন।",
};

const PAGE_SIZE = 12;

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: Promise<{ district?: string; page?: string }>;
}) {
  const params = await searchParams;
  const district = params.district || undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ profiles, total }, districts] = await Promise.all([
    getPublicProfiles({ district, page, pageSize: PAGE_SIZE }),
    getDistrictList(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildHref(next: Partial<{ district: string; page: number }>) {
    const sp = new URLSearchParams();
    const d = next.district ?? district ?? "";
    const p = next.page ?? page;
    if (d) sp.set("district", d);
    if (p && p !== 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/profiles?${qs}` : "/profiles";
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h1 className="text-3xl font-extrabold text-brand-maroon-dark">
            বাংলাদেশের নারী প্রোফাইল
          </h1>
          <p className="mt-2 text-brand-ink/70">
            সীমিত তথ্য এখানে সবাই দেখতে পারবেন। সম্পূর্ণ প্রোফাইল, ছবি ও
            যোগাযোগের তথ্য দেখতে{" "}
            <Link href="/login" className="font-semibold text-brand-maroon underline">
              লগইন
            </Link>{" "}
            করুন।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {districts.length > 0 && (
              <DistrictFilter districts={districts} district={district} />
            )}
          </div>

          {profiles.length === 0 ? (
            <p className="mt-12 text-center text-brand-ink/60">
              কোনো প্রোফাইল পাওয়া যায়নি।
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {profiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildHref({ page: p })}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    p === page
                      ? "bg-brand-maroon text-brand-cream"
                      : "border border-brand-maroon/20 text-brand-ink/70"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
