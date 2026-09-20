const RAW_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8801826785574";

/** Digits-only WhatsApp number, safe to use in an wa.me link. */
export function whatsappNumber(): string {
  return RAW_NUMBER.replace(/[^0-9]/g, "");
}

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${whatsappNumber()}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function membershipWhatsappLink(planName: string): string {
  return whatsappLink(
    `আসসালামু আলাইকুম, আমি Moner Manush-এর ${planName} membership নিতে চাই।`,
  );
}

export function supportWhatsappLink(): string {
  return whatsappLink(
    "আসসালামু আলাইকুম, আমার Moner Manush অ্যাকাউন্ট নিয়ে সহায়তা দরকার।",
  );
}

export function profileInterestWhatsappLink(profileName: string): string {
  return whatsappLink(
    `আসসালামু আলাইকুম, আমি Moner Manush-এ ${profileName}-এর প্রোফাইলটি সম্পর্কে জানতে এবং Membership নিতে চাই।`,
  );
}

export function moreProfilesWhatsappLink(): string {
  return whatsappLink(
    "আসসালামু আলাইকুম, আমি আরও প্রোফাইল দেখতে Moner Manush Membership নিতে চাই।",
  );
}
