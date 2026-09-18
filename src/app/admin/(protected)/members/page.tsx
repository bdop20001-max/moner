import Link from "next/link";
import { prisma } from "@/lib/db";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const gender = params.gender === "MALE" || params.gender === "FEMALE" ? params.gender : undefined;
  const status =
    params.status === "ACTIVE" || params.status === "INACTIVE" || params.status === "SUSPENDED"
      ? params.status
      : undefined;
  const q = params.q?.trim();

  const members = await prisma.member.findMany({
    where: {
      ...(gender ? { gender } : {}),
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { displayName: { contains: q, mode: "insensitive" } },
              { userId: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  function href(next: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { gender, status, q, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) sp.set(k, v);
    });
    const qs = sp.toString();
    return qs ? `/admin/members?${qs}` : "/admin/members";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-brand-maroon-dark">সদস্যরা</h1>
        <Link
          href="/admin/members/new"
          className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream"
        >
          + নতুন সদস্য
        </Link>
      </div>

      <form className="flex flex-wrap items-center gap-2" action="/admin/members">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="নাম বা ইউজার আইডি দিয়ে খুঁজুন"
          className="rounded-full border border-brand-maroon/20 px-4 py-1.5 text-sm"
        />
        {gender && <input type="hidden" name="gender" value={gender} />}
        {status && <input type="hidden" name="status" value={status} />}
        <button className="rounded-full border border-brand-maroon/30 px-4 py-1.5 text-sm text-brand-ink/70">
          খুঁজুন
        </button>

        <span className="mx-1 h-5 w-px bg-brand-ink/10" />

        <Link href={href({ gender: undefined })} className={`rounded-full border px-3 py-1.5 text-sm ${!gender ? "border-brand-maroon bg-brand-maroon text-brand-cream" : "border-brand-maroon/20 text-brand-ink/60"}`}>
          সবাই
        </Link>
        <Link href={href({ gender: "FEMALE" })} className={`rounded-full border px-3 py-1.5 text-sm ${gender === "FEMALE" ? "border-brand-maroon bg-brand-maroon text-brand-cream" : "border-brand-maroon/20 text-brand-ink/60"}`}>
          নারী
        </Link>
        <Link href={href({ gender: "MALE" })} className={`rounded-full border px-3 py-1.5 text-sm ${gender === "MALE" ? "border-brand-maroon bg-brand-maroon text-brand-cream" : "border-brand-maroon/20 text-brand-ink/60"}`}>
          পুরুষ
        </Link>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-brand-maroon/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-brand-ink/50">
              <th className="px-4 py-3">সদস্য</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">লিঙ্গ / বয়স</th>
              <th className="px-4 py-3">জেলা</th>
              <th className="px-4 py-3">স্ট্যাটাস</th>
              <th className="px-4 py-3">ভেরিফিকেশন</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-black/5 last:border-0">
                <td className="flex items-center gap-2 px-4 py-3">
                  <Avatar name={m.displayName} colorKey={m.avatarColor} size={32} />
                  <span className="font-medium text-brand-ink">{m.displayName}</span>
                  {m.isDemo && <Badge tone="neutral">Demo</Badge>}
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{m.userId}</td>
                <td className="px-4 py-3 text-brand-ink/70">
                  {m.gender === "FEMALE" ? "নারী" : "পুরুষ"} · {m.age}
                </td>
                <td className="px-4 py-3 text-brand-ink/70">{m.district}</td>
                <td className="px-4 py-3">
                  <Badge tone={m.status === "ACTIVE" ? "green" : m.status === "SUSPENDED" ? "rose" : "neutral"}>
                    {STATUS_LABEL[m.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={m.verification === "VERIFIED" ? "green" : "neutral"}>
                    {m.verification}
                  </Badge>
                </td>
                <td className="px-4 py-3">{m.featured ? "✓" : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/members/${m.id}`} className="font-semibold text-brand-maroon hover:underline">
                    বিস্তারিত
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-brand-ink/60">কোনো সদস্য পাওয়া যায়নি।</p>
        )}
      </div>
    </div>
  );
}
