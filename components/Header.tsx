"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Location } from "@/types/rsvp";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Get location from URL params
    const locationParam = searchParams.get("location");
    if (
      locationParam &&
      ["Lagos", "London", "Portugal"].includes(locationParam)
    ) {
      setLocation(locationParam as Location);
    } else {
      // Default to Lagos if no location param
      setLocation("Lagos");
    }
  }, [searchParams]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const getMenuItems = () => {
    if (!location) return [];

    switch (location) {
      case "Lagos":
        return [
          { id: "location", label: "LOCATION" },
          { id: "asoebi", label: "ASOEBI" },
          { id: "registry", label: "REGISTRY" },
        ];
      case "London":
        return [
          { id: "location", label: "LOCATION" },
          { id: "registry", label: "REGISTRY" },
        ];
      case "Portugal":
        return [
          { id: "location", label: "LOCATION" },
          { id: "accommodation", label: "ACCOMMODATION" },
          { id: "dress-code", label: "DRESS CODE" },
          { id: "registry", label: "REGISTRY" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav
      ref={headerRef}
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      {/* Desktop header */}
      <div className="hidden md:block px-4 py-4">
        <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <button
              onClick={scrollToTop}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Scroll to top"
            >
              <img
                src="/images/JoDa Logo.svg"
                alt="Damola & João"
                className="h-10 w-auto"
              />
            </button>
          </div>

          {/* Middle: Menu items */}
          <div className="flex gap-6 text-sm uppercase tracking-wider justify-center">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="hover:underline whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right: RSVP button */}
          <div className="flex justify-end">
            <button
              onClick={() => scrollToSection("rsvp")}
              className="text-sm uppercase tracking-wider border border-[#5a6134] text-[#5a6134] px-4 py-2 hover:bg-[#5a6134] hover:text-white transition-colors"
            >
              RSVP
            </button>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <button
            onClick={scrollToTop}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Scroll to top"
          >
            <img
              src="/images/JoDa Logo.svg"
              alt="Damola & João"
              className="h-8 w-auto"
            />
          </button>

          {/* Right: Hamburger + RSVP */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToSection("rsvp")}
              className="text-xs uppercase tracking-wider border border-[#5a6134] text-[#5a6134] px-3 py-1.5 hover:bg-[#5a6134] hover:text-white transition-colors"
            >
              RSVP
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm uppercase tracking-wider text-left py-2 hover:text-[#5a6134] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
