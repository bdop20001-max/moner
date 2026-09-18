import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "gold" | "green" | "rose" | "neutral";
};

const TONES: Record<NonNullable<BadgeProps["tone"]>, string> = {
  gold: "bg-brand-gold-light text-brand-maroon-dark",
  green: "bg-emerald-100 text-emerald-800",
  rose: "bg-brand-rose-light text-brand-maroon-dark",
  neutral: "bg-black/5 text-brand-ink",
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
