"use client";

import { useState } from "react";

export function ProfileActions({
  memberId,
  initialLiked,
  initialSaved,
}: {
  memberId: string;
  initialLiked: boolean;
  initialSaved: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    setBusy(true);
    const res = await fetch("/api/member/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
    }
    setBusy(false);
  }

  async function toggleSave() {
    setBusy(true);
    const res = await fetch("/api/member/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    }
    setBusy(false);
  }

  async function submitReport() {
    if (!reason.trim()) return;
    setBusy(true);
    const res = await fetch("/api/member/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedId: memberId, reason }),
    });
    setBusy(false);
    if (res.ok) {
      setMessage("রিপোর্ট জমা দেওয়া হয়েছে। ধন্যবাদ।");
      setReporting(false);
      setReason("");
    } else {
      setMessage("রিপোর্ট জমা দিতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={toggleLike}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            liked
              ? "bg-brand-rose text-white"
              : "border border-brand-rose text-brand-rose hover:bg-brand-rose/10"
          }`}
        >
          {liked ? "❤ পছন্দ করেছেন" : "🤍 পছন্দ করুন"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={toggleSave}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
            saved
              ? "bg-brand-gold text-brand-maroon-dark"
              : "border border-brand-gold text-brand-maroon-dark hover:bg-brand-gold/10"
          }`}
        >
          {saved ? "সংরক্ষিত" : "সংরক্ষণ করুন"}
        </button>
        <button
          type="button"
          onClick={() => setReporting((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-brand-ink/20 px-5 py-2 text-sm font-semibold text-brand-ink/60 hover:bg-black/5"
        >
          Report
        </button>
      </div>

      {reporting && (
        <div className="rounded-xl border border-brand-ink/10 bg-white p-4">
          <label className="text-sm font-medium text-brand-ink/80">
            কারণ লিখুন
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border border-brand-ink/20 p-2 text-sm"
            placeholder="যেমন: ভুয়া প্রোফাইল, অনুপযুক্ত আচরণ..."
          />
          <button
            type="button"
            disabled={busy || !reason.trim()}
            onClick={submitReport}
            className="mt-2 rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream disabled:opacity-50"
          >
            রিপোর্ট জমা দিন
          </button>
        </div>
      )}

      {message && <p className="text-sm text-emerald-700">{message}</p>}
    </div>
  );
}
