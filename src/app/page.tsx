import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { FeaturedProfiles } from "@/components/landing/FeaturedProfiles";
import { MembershipPlans } from "@/components/landing/MembershipPlans";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SafetySection } from "@/components/landing/SafetySection";
import { getActivePlans, getFeaturedProfiles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profiles, plans] = await Promise.all([
    getFeaturedProfiles(8),
    getActivePlans(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProfiles profiles={profiles} />
        <MembershipPlans plans={plans} />
        <HowItWorks />
        <SafetySection />
      </main>
      <Footer />
    </>
  );
}
