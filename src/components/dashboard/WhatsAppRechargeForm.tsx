"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/whatsapp";

const PRESET_AMOUNTS = [200, 500, 1000, 2000];

export function WhatsAppRechargeForm({ userId }: { userId: string }) {
  const [amount, setAmount] = useState(500);

  const link = whatsappLink(
    `আসসালামু আলাইকুম, আমার User ID ${userId}। আমি ৳${amount} ওয়ালেট রিচার্জ করতে চাই।`,
  );

  return (
    <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
      <h2 className="font-bold text-brand-maroon-dark">Wallet Recharge</h2>
      <p className="mt-1 text-sm text-brand-ink/60">
        পরিমাণ বেছে নিন, তারপর WhatsApp-এ পেমেন্ট নিশ্চিত করুন। যাচাইয়ের পর
        অ্যাডমিন আপনার ওয়ালেটে ব্যালেন্স যোগ করে দেবেন।
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAmount(a)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              amount === a
                ? "border-brand-maroon bg-brand-maroon text-brand-cream"
                : "border-brand-maroon/30 text-brand-ink/70"
            }`}
          >
            ৳{a}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-sm text-brand-ink/70">কাস্টম পরিমাণ (৳)</label>
        <input
          type="number"
          min={50}
          step={50}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          className="mt-1 w-full rounded-lg border border-brand-ink/20 px-4 py-2 text-sm"
        />
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe57]"
      >
        WhatsApp-এ রিচার্জ করুন
      </a>
    </div>
  );
}
