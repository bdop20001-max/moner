"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।");
      return;
    }

    setMessage("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4">
      {error && <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</p>}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</p>
      )}

      <div>
        <label className="text-sm font-medium text-brand-ink/80">বর্তমান পাসওয়ার্ড</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-ink/80">নতুন পাসওয়ার্ড</label>
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-ink/80">নতুন পাসওয়ার্ড নিশ্চিত করুন</label>
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-cream disabled:opacity-60"
      >
        {saving ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
      </button>
    </form>
  );
}
