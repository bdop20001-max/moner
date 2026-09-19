"use client";

import { useRouter } from "next/navigation";

export function DistrictFilter({
  districts,
  district,
}: {
  districts: string[];
  district?: string;
}) {
  const router = useRouter();

  function handleChange(nextDistrict: string) {
    const sp = new URLSearchParams();
    if (nextDistrict) sp.set("district", nextDistrict);
    const qs = sp.toString();
    router.push(qs ? `/profiles?${qs}` : "/profiles");
  }

  return (
    <select
      defaultValue={district ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-brand-maroon/30 bg-white px-4 py-1.5 text-sm text-brand-ink/70"
    >
      <option value="">সব জেলা</option>
      {districts.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}
