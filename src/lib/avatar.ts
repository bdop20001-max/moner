/**
 * Deterministic placeholder avatars.
 *
 * Moner Manush never ships stock or scraped photos of real people. Members
 * appear with a generated initials avatar until an admin uploads a verified,
 * consented photo for their account (see MemberPhoto in prisma/schema.prisma).
 */

export const AVATAR_PALETTES: Record<string, [string, string]> = {
  rose: ["#e11d48", "#881337"],
  maroon: ["#9f1239", "#4c0519"],
  gold: ["#d97706", "#78350f"],
  plum: ["#a21caf", "#581c87"],
  teal: ["#0d9488", "#134e4a"],
  indigo: ["#4f46e5", "#312e81"],
};

export const AVATAR_COLOR_KEYS = Object.keys(AVATAR_PALETTES);

export function pickAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLOR_KEYS[hash % AVATAR_COLOR_KEYS.length];
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
