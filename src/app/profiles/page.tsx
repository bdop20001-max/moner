import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileCard } from "@/components/profiles/ProfileCard";
import { DistrictFilter } from "@/components/profiles/DistrictFilter";
import { getDistrictList, getPublicProfiles } from "@/lib/data";
import Link from "next/link";
import { freeProfileLimit, getMembershipAccess } from "@/lib/membership-access";
import { moreProfilesWhatsappLink } from "@/lib/whatsapp";

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
  const access = await getMembershipAccess();
  const canViewFullProfiles = access.hasActiveMembership;
  const page = canViewFullProfiles ? Math.max(1, Number(params.page) || 1) : 1;
  const pageSize = canViewFullProfiles ? PAGE_SIZE : freeProfileLimit();

  const [{ profiles, total }, districts] = await Promise.all([
    getPublicProfiles({ district, page, pageSize }),
    getDistrictList(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
            {canViewFullProfiles
              ? "আপনার সক্রিয় Membership দিয়ে সম্পূর্ণ প্রোফাইল তালিকা দেখুন।"
              : `Membership ছাড়াই সর্বোচ্চ ${pageSize}টি প্রোফাইল preview দেখুন। সম্পূর্ণ access পেতে WhatsApp-এ যোগাযোগ করুন।`}
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
                <ProfileCard key={profile.id} profile={profile} canViewFullProfile={canViewFullProfiles} />
              ))}
            </div>
          )}

          {canViewFullProfiles && totalPages > 1 && (
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

          {!canViewFullProfiles && (
            <div className="mt-10 text-center">
              <a
                href={moreProfilesWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-7 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#1fbd5a]"
              >
                WhatsApp-এ আরও প্রোফাইল দেখুন
              </a>
              <p className="mt-3 text-sm text-brand-ink/60">
                সক্রিয় Membership নিলে সম্পূর্ণ profile list ও profile details দেখতে পারবেন।
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
