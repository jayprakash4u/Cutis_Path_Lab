import { Fragment } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import QuickActions from "@/components/landing/QuickActions";
import BookTest from "@/components/landing/BookTest";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/layout/Footer";
import HealthTips from "@/components/sections/HealthTips";
import Stats from "@/components/landing/Stats";
import PopularTestsPackages from "@/components/landing/PopularTestsPackages";
import TestByDiseaseCategories from "@/components/landing/TestByDiseaseCategories";
import TestsInOffers from "@/components/landing/TestsInOffers";
import LabTechnology from "@/components/landing/LabTechnology";
import AboutUsSection from "@/components/landing/AboutUsSection";
import DoctorReferrals from "@/components/landing/DoctorReferrals";
import TeamSection from "@/components/landing/TeamSection";
import { getHeroBanners } from "@/lib/heroBanners";
import { getHomeSections } from "@/lib/homeContent";

/**
 * Which component renders each `sectionKey`. The order, the copy and the
 * visibility come from the HomeSection table (Admin → Home page); a key with no
 * entry here is simply skipped, so adding a row cannot break the page.
 */
const RENDERERS = {
  hero: (section, extra) => (
    <Hero section={section} items={section.items} slides={extra.heroSlides} />
  ),
  quickActions: (section) => <QuickActions items={section.items} />,
  offers: (section) => <TestsInOffers section={section} />,
  stats: (section) => <Stats section={section} items={section.items} />,
  diseaseCategories: (section) => (
    <TestByDiseaseCategories section={section} items={section.items} />
  ),
  bookTest: (section) => <BookTest section={section} />,
  popular: (section) => <PopularTestsPackages section={section} />,
  healthTips: (section) => <HealthTips section={section} items={section.items} />,
  labTechnology: (section) => <LabTechnology section={section} items={section.items} />,
  about: (section) => <AboutUsSection section={section} items={section.items} />,
  referrals: (section) => <DoctorReferrals section={section} />,
  testimonials: (section) => <Testimonials section={section} />,
  team: (section) => <TeamSection section={section} items={section.items} />,
};

// The section rows are edited in the admin panel, so the page is rendered per
// request rather than baked at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const sections = await getHomeSections();

  // Saved slides win. Only when there are none does the folder scan run — it
  // reads the banners from disk so a re-exported file cannot 404 the slide.
  const heroHasSlides = sections.some((s) => s.key === "hero" && s.items?.length);
  const heroSlides = heroHasSlides ? [] : getHeroBanners();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-below-nav pb-24 lg:pb-0">
        {sections.map((section) => {
          const render = RENDERERS[section.key];
          if (!render) return null;
          return (
            <Fragment key={section.key}>{render(section, { heroSlides })}</Fragment>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
