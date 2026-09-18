"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MemberData = {
  id: string;
  displayName: string;
  gender: "MALE" | "FEMALE";
  age: number;
  district: string;
  profession: string;
  bio: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  verification: "UNVERIFIED" | "PENDING" | "VERIFIED";
  featured: boolean;
};

type Plan = { id: string; name: string; price: number };

export function MemberAdminPanel({ member, plans }: { member: MemberData; plans: Plan[] }) {
  const router = useRouter();
  const [form, setForm] = useState(member);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [walletAmount, setWalletAmount] = useState(0);
  const [walletCredits, setWalletCredits] = useState(0);
  const [walletNote, setWalletNote] = useState("");
  const [savingWallet, setSavingWallet] = useState(false);
  const [walletMsg, setWalletMsg] = useState<string | null>(null);

  const [planId, setPlanId] = useState(plans[0]?.id ?? "");
  const [assigningPlan, setAssigningPlan] = useState(false);
  const [planMsg, setPlanMsg] = useState<string | null>(null);

  const [resetting, setResetting] = useState(false);
  const [newTempPassword, setNewTempPassword] = useState<string | null>(null);

  function update<K extends keyof MemberData>(key: K, value: MemberData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    const res = await fetch(`/api/admin/members/${member.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSavingProfile(false);
    setProfileMsg(res.ok ? "সংরক্ষিত হয়েছে।" : "সংরক্ষণ ব্যর্থ হয়েছে।");
    router.refresh();
  }

  async function submitWallet(e: React.FormEvent) {
    e.preventDefault();
    setSavingWallet(true);
    setWalletMsg(null);
    const res = await fetch(`/api/admin/members/${member.id}/wallet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: walletAmount, credits: walletCredits, note: walletNote }),
    });
    setSavingWallet(false);
    setWalletMsg(res.ok ? "ওয়ালেট হালনাগাদ হয়েছে।" : "ব্যর্থ হয়েছে।");
    setWalletAmount(0);
    setWalletCredits(0);
    setWalletNote("");
    router.refresh();
  }

  async function assignPlan() {
    if (!planId) return;
    setAssigningPlan(true);
    setPlanMsg(null);
    const res = await fetch(`/api/admin/members/${member.id}/membership`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    setAssigningPlan(false);
    setPlanMsg(res.ok ? "প্ল্যান নির্ধারণ হয়েছে।" : "ব্যর্থ হয়েছে।");
    router.refresh();
  }

  async function resetPassword() {
    setResetting(true);
    setNewTempPassword(null);
    const res = await fetch(`/api/admin/members/${member.id}/reset-password`, {
      method: "POST",
    });
    const data = await res.json().catch(() => ({}));
    setResetting(false);
    if (res.ok) setNewTempPassword(data.tempPassword);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={saveProfile} className="rounded-2xl border border-brand-maroon/10 bg-white p-6 space-y-4">
        <h2 className="font-bold text-brand-maroon-dark">প্রোফাইল তথ্য</h2>
        {profileMsg && <p className="text-sm text-emerald-700">{profileMsg}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-brand-ink/80">নাম</label>
            <input
              value={form.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">জেলা</label>
            <input
              value={form.district}
              onChange={(e) => update("district", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">লিঙ্গ</label>
            <select
              value={form.gender}
              onChange={(e) => update("gender", e.target.value as MemberData["gender"])}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            >
              <option value="FEMALE">নারী</option>
              <option value="MALE">পুরুষ</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">বয়স</label>
            <input
              type="number"
              min={18}
              max={90}
              value={form.age}
              onChange={(e) => update("age", Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">পেশা</label>
            <input
              value={form.profession}
              onChange={(e) => update("profession", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">ইমেইল</label>
            <input
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">ফোন</label>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-brand-ink/80">পরিচিতি (Bio)</label>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-brand-ink/80">স্ট্যাটাস</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as MemberData["status"])}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-brand-ink/80">ভেরিফিকেশন</label>
            <select
              value={form.verification}
              onChange={(e) => update("verification", e.target.value as MemberData["verification"])}
              className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
            >
              <option value="UNVERIFIED">Unverified</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="featured" className="text-sm font-medium text-brand-ink/80">
              Landing page-এ Featured করুন
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="rounded-full bg-brand-maroon px-6 py-2.5 text-sm font-semibold text-brand-cream disabled:opacity-60"
        >
          {savingProfile ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={submitWallet} className="rounded-2xl border border-brand-maroon/10 bg-white p-6 space-y-3">
          <h2 className="font-bold text-brand-maroon-dark">ওয়ালেট সমন্বয়</h2>
          {walletMsg && <p className="text-sm text-emerald-700">{walletMsg}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-brand-ink/70">টাকা (+/-)</label>
              <input
                type="number"
                value={walletAmount}
                onChange={(e) => setWalletAmount(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-brand-ink/20 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-brand-ink/70">ক্রেডিট (+/-)</label>
              <input
                type="number"
                value={walletCredits}
                onChange={(e) => setWalletCredits(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-brand-ink/20 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <input
            placeholder="নোট (ঐচ্ছিক)"
            value={walletNote}
            onChange={(e) => setWalletNote(e.target.value)}
            className="w-full rounded-lg border border-brand-ink/20 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={savingWallet}
            className="rounded-full bg-brand-gold px-5 py-2 text-sm font-semibold text-brand-maroon-dark disabled:opacity-60"
          >
            {savingWallet ? "হচ্ছে..." : "সমন্বয় করুন"}
          </button>
        </form>

        <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6 space-y-3">
          <h2 className="font-bold text-brand-maroon-dark">মেম্বারশিপ প্ল্যান নির্ধারণ</h2>
          {planMsg && <p className="text-sm text-emerald-700">{planMsg}</p>}
          <select
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            className="w-full rounded-lg border border-brand-ink/20 px-3 py-2 text-sm"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (৳{p.price})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={assignPlan}
            disabled={assigningPlan || !planId}
            className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream disabled:opacity-60"
          >
            {assigningPlan ? "হচ্ছে..." : "প্ল্যান নির্ধারণ করুন"}
          </button>

          <div className="border-t border-black/5 pt-3">
            <h3 className="text-sm font-semibold text-brand-ink/80">পাসওয়ার্ড রিসেট</h3>
            <button
              type="button"
              onClick={resetPassword}
              disabled={resetting}
              className="mt-2 rounded-full border border-brand-maroon px-5 py-2 text-sm font-semibold text-brand-maroon disabled:opacity-60"
            >
              {resetting ? "হচ্ছে..." : "নতুন Temporary Password তৈরি করুন"}
            </button>
            {newTempPassword && (
              <p className="mt-2 rounded-lg bg-brand-gold/10 p-2 font-mono text-sm">
                নতুন পাসওয়ার্ড: <strong>{newTempPassword}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
