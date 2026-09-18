import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ first?: string }>;
}) {
  const params = await searchParams;
  const isFirstLogin = params.first === "1";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-maroon-dark">পাসওয়ার্ড পরিবর্তন</h1>

      {isFirstLogin && (
        <div className="rounded-xl border border-brand-gold/50 bg-brand-gold/10 p-4 text-sm text-brand-maroon-dark">
          নিরাপত্তার জন্য, আপনার temporary পাসওয়ার্ডটি এখনই পরিবর্তন করুন।
        </div>
      )}

      <div className="rounded-2xl border border-brand-maroon/10 bg-white p-6">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
