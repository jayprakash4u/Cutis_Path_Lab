import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import BookTest from "@/components/landing/BookTest";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/layout/Footer";
import HealthTips from "@/components/sections/HealthTips";
import Stats from "@/components/landing/Stats";
import PopularTestsPackages from "@/components/landing/PopularTestsPackages";
import TestByDiseaseCategories from "@/components/landing/TestByDiseaseCategories";
import TestsInOffers from "@/components/landing/TestsInOffers";
import LabTechnology from "@/components/landing/LabTechnology";
import DoctorReferrals from "@/components/landing/DoctorReferrals";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-[80px] lg:pt-[88px] pb-20 xl:pb-0">
        <Hero />
        <TestsInOffers />
        <Stats />
        <TestByDiseaseCategories />
        <BookTest />
        <PopularTestsPackages />
        <HealthTips />
        <LabTechnology />
        <DoctorReferrals />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
