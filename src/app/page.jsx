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
import { getHeroBanners } from "@/lib/heroBanners";

export default function Home() {
  // Read from disk on the server so a re-exported banner cannot 404 the slide.
  const heroSlides = getHeroBanners();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-below-nav pb-24 lg:pb-0">
        <Hero slides={heroSlides} />
        <QuickActions />
        <TestsInOffers />
        <Stats />
        <TestByDiseaseCategories />
        <BookTest />
        <PopularTestsPackages />
        <HealthTips />
        <LabTechnology />
        <AboutUsSection />
        <DoctorReferrals />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
