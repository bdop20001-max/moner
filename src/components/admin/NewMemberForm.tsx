"use client";

import { useState } from "react";
import Link from "next/link";

type Plan = { id: string; name: string; price: number };

const DISTRICTS_HINT = "যেমন: ঢাকা, চট্টগ্রাম, খুলনা...";

export function NewMemberForm({ plans }: { plans: Plan[] }) {
  const [form, setForm] = useState({
    displayName: "",
    gender: "FEMALE",
    age: "18",
    district: "",
    profession: "",
    bio: "",
    email: "",
    phone: "",
    planId: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ userId: string; tempPassword: string } | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "সদস্য তৈরি ব্যর্থ হয়েছে।");
      return;
    }

    setResult({ userId: data.member.userId, tempPassword: data.tempPassword });
  }

  if (result) {
    return (
      <div className="rounded-2xl border border-brand-gold/50 bg-brand-gold/10 p-6">
        <h2 className="font-bold text-brand-maroon-dark">সদস্য তৈরি হয়েছে ✓</h2>
        <p className="mt-2 text-sm text-brand-ink/70">
          এই তথ্য শুধুমাত্র একবার দেখানো হচ্ছে। এখনই সদস্যকে WhatsApp-এ
          পাঠিয়ে দিন।
        </p>
        <div className="mt-4 space-y-2 rounded-xl bg-white p-4 font-mono text-sm">
          <p>User ID: <strong>{result.userId}</strong></p>
          <p>Temporary Password: <strong>{result.tempPassword}</strong></p>
        </div>
        <div className="mt-4 flex gap-3">
          <Link href="/admin/members" className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream">
            সদস্য তালিকায় ফিরুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}

      <div>
        <label className="text-sm font-medium text-brand-ink/80">নাম</label>
        <input
          required
          value={form.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-brand-ink/80">লিঙ্গ</label>
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          >
            <option value="FEMALE">নারী</option>
            <option value="MALE">পুরুষ</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-brand-ink/80">বয়স (১৮+)</label>
          <input
            type="number"
            min={18}
            max={90}
            required
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">জেলা</label>
        <input
          required
          value={form.district}
          onChange={(e) => update("district", e.target.value)}
          placeholder={DISTRICTS_HINT}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">পেশা</label>
        <input
          value={form.profession}
          onChange={(e) => update("profession", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">পরিচিতি (Bio)</label>
        <textarea
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-brand-ink/80">ইমেইল</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-ink/80">ফোন</label>
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">মেম্বারশিপ প্ল্যান (ঐচ্ছিক)</label>
        <select
          value={form.planId}
          onChange={(e) => update("planId", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        >
          <option value="">কোনোটি নির্বাচন করা হয়নি</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (৳{p.price})
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-cream disabled:opacity-60"
      >
        {saving ? "তৈরি হচ্ছে..." : "সদস্য তৈরি করুন"}
      </button>
    </form>
  );
}
