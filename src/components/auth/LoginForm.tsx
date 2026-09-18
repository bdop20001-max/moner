"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/member-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "লগইন ব্যর্থ হয়েছে।");
      return;
    }

    router.push(data.mustChangePassword ? "/dashboard/settings?first=1" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="userId" className="text-sm font-medium text-brand-ink/80">
          User ID
        </label>
        <input
          id="userId"
          type="text"
          required
          autoComplete="username"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="MM-10234"
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm focus:border-brand-maroon focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-brand-ink/80">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2.5 text-sm focus:border-brand-maroon focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand-maroon px-5 py-2.5 text-sm font-semibold text-brand-cream shadow-sm transition-colors hover:bg-brand-maroon-dark disabled:opacity-60"
      >
        {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
      </button>
    </form>
  );
}
