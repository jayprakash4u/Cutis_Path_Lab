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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-below-nav pb-24 lg:pb-0">
        <Hero />
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
