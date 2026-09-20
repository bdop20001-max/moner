import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { profileInterestWhatsappLink } from "@/lib/whatsapp";

export type ProfileCardData = {
  id: string;
  displayName: string;
  age: number;
  district: string;
  profession?: string | null;
  verification: "UNVERIFIED" | "PENDING" | "VERIFIED";
  avatarColor: string;
  imageUrl?: string | null;
  isDemo?: boolean;
};

export function ProfileCard({
  profile,
  canViewFullProfile = false,
}: {
  profile: ProfileCardData;
  canViewFullProfile?: boolean;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-maroon/10 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-[4/5] items-center justify-center bg-brand-cream-dark">
        {profile.imageUrl ? (
          <Image
            src={profile.imageUrl}
            alt={`${profile.displayName}-এর প্রোফাইল ছবি`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <Avatar
            name={profile.displayName}
            colorKey={profile.avatarColor}
            size={120}
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {profile.verification === "VERIFIED" && (
            <Badge tone="green">✓ Verified</Badge>
          )}
          {profile.isDemo && <Badge tone="neutral">Demo</Badge>}
        </div>
        <div className="absolute right-3 top-3">
          <Badge tone="gold">অনলাইন</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-brand-maroon-dark">
            {profile.displayName}
          </h3>
          <span className="text-sm text-brand-ink/60">{profile.age} বছর</span>
        </div>
        <p className="text-sm text-brand-ink/70">{profile.district}</p>
        {profile.profession && (
          <p className="truncate text-sm text-brand-ink/60">
            {profile.profession}
          </p>
        )}

        {canViewFullProfile ? (
          <Link
            href={`/profiles/${profile.id}`}
            className="mt-3 inline-flex items-center justify-center rounded-full border border-brand-maroon px-4 py-2 text-sm font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
          >
            প্রোফাইল দেখুন
          </Link>
        ) : (
          <a
            href={profileInterestWhatsappLink(profile.displayName)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center justify-center rounded-full border border-brand-maroon px-4 py-2 text-sm font-semibold text-brand-maroon transition-colors hover:bg-brand-maroon hover:text-brand-cream"
          >
            প্রোফাইল দেখুন
          </a>
        )}
      </div>
    </div>
  );
}
