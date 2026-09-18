"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PlanInitial = {
  id?: string;
  name: string;
  slug: string;
  price: number;
  durationDays: number;
  chatCredits: number;
  features: string[];
  active: boolean;
  sortOrder: number;
};

export function PlanForm({ initial }: { initial: PlanInitial }) {
  const router = useRouter();
  const isEdit = !!initial.id;
  const [form, setForm] = useState({
    name: initial.name,
    slug: initial.slug,
    price: initial.price,
    durationDays: initial.durationDays,
    chatCredits: initial.chatCredits,
    features: initial.features.join("\n"),
    active: initial.active,
    sortOrder: initial.sortOrder,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const url = isEdit ? `/api/admin/plans/${initial.id}` : "/api/admin/plans";
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "সংরক্ষণ ব্যর্থ হয়েছে।");
      return;
    }
    router.push("/admin/plans");
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    if (!confirm("আপনি কি নিশ্চিত এই প্ল্যানটি মুছে ফেলতে চান?")) return;
    await fetch(`/api/admin/plans/${initial.id}`, { method: "DELETE" });
    router.push("/admin/plans");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}

      <div>
        <label className="text-sm font-medium text-brand-ink/80">প্ল্যানের নাম</label>
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">Slug (URL-safe)</label>
        <input
          required
          value={form.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="basic, premium, vip"
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-brand-ink/80">মূল্য (৳)</label>
          <input
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => update("price", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-ink/80">মেয়াদ (দিন)</label>
          <input
            type="number"
            min={1}
            value={form.durationDays}
            onChange={(e) => update("durationDays", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-ink/80">চ্যাট ক্রেডিট</label>
          <input
            type="number"
            min={0}
            value={form.chatCredits}
            onChange={(e) => update("chatCredits", Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">ফিচার (প্রতি লাইনে একটি)</label>
        <textarea
          value={form.features}
          onChange={(e) => update("features", e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          placeholder={"সীমিত প্রোফাইল অ্যাক্সেস\nবেসিক সাপোর্ট"}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="active"
          type="checkbox"
          checked={form.active}
          onChange={(e) => update("active", e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="active" className="text-sm font-medium text-brand-ink/80">
          পাবলিকভাবে দৃশ্যমান (Active)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-cream disabled:opacity-60"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full border border-rose-300 px-6 py-2.5 text-sm font-semibold text-rose-600"
          >
            মুছে ফেলুন
          </button>
        )}
      </div>
    </form>
  );
}
