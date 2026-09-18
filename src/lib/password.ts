import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

const TEMP_PASSWORD_CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** Generates a random temporary password for admin-created member accounts. */
export function generateTempPassword(length = 10): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += TEMP_PASSWORD_CHARS[
      Math.floor(Math.random() * TEMP_PASSWORD_CHARS.length)
    ];
  }
  return out;
}

/** Generates a human-friendly unique member login ID, e.g. MM-48213. */
export function generateMemberUserId(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `MM-${n}`;
}
