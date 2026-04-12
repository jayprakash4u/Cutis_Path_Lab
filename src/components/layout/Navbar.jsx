"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BuildingIcon, LocationIcon, PhoneIcon, EmailIcon, FacebookIcon, InstagramIcon, TwitterIcon, WhatsAppIcon, SearchIcon } from "./NavIcons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tests", label: "Our Tests" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarPosition, setNavbarPosition] = useState('top');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const remainingToBottom = docHeight - scrollY - winHeight;

      if (remainingToBottom < 150) {
        setNavbarPosition("hidden");
      } else {
        setNavbarPosition("top");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    navbarPosition === 'hidden' ? null : (
    <div className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
      navbarPosition === 'bottom' ? 'bottom-0' : 'top-0'
    }`}>

      {/* TOP BAR */}
      <div className="bg-sky-600 text-white py-1.5 border-b border-sky-700">
        <div className="w-full px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 text-sm font-medium">

            {/* Left Info */}
            <div className="flex items-center flex-wrap gap-6">
              <span className="font-semibold tracking-wide flex items-center gap-1.5">
                <BuildingIcon size={16} className="text-white" />
                Cutis Lab Path
              </span>

              <span className="opacity-80">|</span>

              <span className="flex items-center gap-1.5">
                <LocationIcon size={16} className="text-white" />
                Kathmandu, Bagmati, Nepal
              </span>

              <span className="opacity-80">|</span>

              <span className="flex items-center gap-1.5">
                <PhoneIcon size={16} className="text-white" />
                Ph No - +977-9825849435
              </span>

              <span className="opacity-80">|</span>

              <span className="flex items-center gap-1.5">
                <EmailIcon size={16} className="text-white" />
                Email - cutislabpath@gmail.com
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mr-8">

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <FacebookIcon size={20} />
              </a>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <InstagramIcon size={20} />
              </a>

              {/* Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <TwitterIcon size={20} />
              </a>

              {/* WhatsApp */}
              <a href="https://wa.me/9779825849435" target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition">
                <WhatsAppIcon size={20} />
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className="bg-white border-b border-sky-300 shadow-lg relative">
        <div className="w-full px-6">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/cutis.png"
                alt="CUTIS Lab"
                width={160}
                height={60}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>

            {/* Desktop Menu - Left Aligned */}
            <div className="hidden lg:flex items-center gap-1 ml-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2.5 text-base font-medium rounded-lg transition relative ${
                    pathname === link.href
                      ? "text-sky-600"
                      : "text-slate-800 hover:text-sky-600"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-[#FF6B6B] rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section - Search and Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search Box */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search tests & packages"
                  className="w-64 px-4 py-2 pr-12 text-black border border-sky-300 rounded-lg bg-white focus:border-sky-300 focus:outline-none"
                />
                <div className="absolute right-0 top-0 bottom-0 w-9 bg-[#FF6B6B] rounded-lg flex items-center justify-center">
                  <SearchIcon size={16} className="text-white" />
                </div>
              </div>

              <Link
                href="/book"
                className="px-5 py-2 bg-sky-600 text-white rounded-lg text-base font-semibold hover:bg-sky-700 transition shadow-md hover:shadow-lg"
              >
                Book Test
              </Link>

              <Link
                href="/download-report"
                className="px-4 py-2 border-2 border-sky-600 text-sky-600 rounded-lg text-base font-semibold hover:bg-sky-50 transition"
              >
                Report
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* HANGING OFFER BADGE - LEFT SIDE */}
        <div className="absolute left-6 lg:left-12 top-full z-40">
          {/* Strings/Ropes */}
          <div className="flex justify-center gap-4 mb-[-6px]">
            <div className="w-[1.5px] h-6 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full shadow-sm"></div>
            <div className="w-[1.5px] h-6 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full shadow-sm"></div>
          </div>
          
          {/* Badge */}
          <div className="offer-badge animate-swing hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="relative">
              {/* Outer Ring */}
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 shadow-xl flex items-center justify-center border-3 border-white">
                {/* Inner Circle */}
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-inner">
                  {/* Content */}
                  <div className="text-center text-white">
                    <div className="text-[8px] lg:text-[9px] font-bold tracking-wider">10%</div>
                    <div className="text-[6px] lg:text-[7px] font-extrabold tracking-widest mt-0.5">OFFER</div>
                  </div>
                </div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute top-1.5 left-2 w-3 h-3 bg-white/30 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
  );
}
