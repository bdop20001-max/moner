import { AVATAR_PALETTES, initialsFromName } from "@/lib/avatar";

type AvatarProps = {
  name: string;
  colorKey?: string;
  size?: number;
  className?: string;
};

/**
 * Deterministic initials avatar. Used whenever a member has no admin-uploaded,
 * consented profile photo — Moner Manush never falls back to stock photos.
 */
export function Avatar({ name, colorKey = "rose", size = 96, className = "" }: AvatarProps) {
  const [from, to] = AVATAR_PALETTES[colorKey] ?? AVATAR_PALETTES.rose;
  const initials = initialsFromName(name);
  const gradientId = `grad-${colorKey}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="16" fill={`url(#${gradientId})`} />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontSize="34"
        fontWeight="700"
        fill="#fff"
        fontFamily="var(--font-bengali), sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
}
