"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  displayName: string;
  district: string;
  profession: string;
  bio: string;
  email: string;
  phone: string;
};

export function ProfileEditForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await fetch("/api/member/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "সংরক্ষণ ব্যর্থ হয়েছে।");
      return;
    }
    setMessage("প্রোফাইল সফলভাবে হালনাগাদ হয়েছে।");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p>
      )}

      <div>
        <label className="text-sm font-medium text-brand-ink/80">নাম (Display Name)</label>
        <input
          value={form.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-brand-ink/80">জেলা</label>
        <input
          value={form.district}
          onChange={(e) => update("district", e.target.value)}
          required
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
          rows={4}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-cream disabled:opacity-60"
      >
        {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
      </button>
    </form>
  );
}
