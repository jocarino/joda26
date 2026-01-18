"use client";

import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Location } from "@/types/rsvp";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const searchParams = useSearchParams();
  const [location, setLocation] = useState<Location | null>(null);

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
  };

  const renderMenuItems = () => {
    if (!location) return null;

    switch (location) {
      case "Lagos":
        return (
          <>
            <button
              onClick={() => scrollToSection("location")}
              className="hover:underline"
            >
              LOCATION
            </button>
            <button
              onClick={() => scrollToSection("asoebi")}
              className="hover:underline"
            >
              ASOEBI
            </button>
            <button
              onClick={() => scrollToSection("registry")}
              className="hover:underline"
            >
              REGISTRY
            </button>
          </>
        );
      case "London":
        return (
          <>
            <button
              onClick={() => scrollToSection("location")}
              className="hover:underline"
            >
              LOCATION
            </button>
            <button
              onClick={() => scrollToSection("registry")}
              className="hover:underline"
            >
              REGISTRY
            </button>
          </>
        );
      case "Portugal":
        return (
          <>
            <button
              onClick={() => scrollToSection("location")}
              className="hover:underline"
            >
              LOCATION
            </button>
            <button
              onClick={() => scrollToSection("accommodation")}
              className="hover:underline"
            >
              ACCOMMODATION
            </button>
            <button
              onClick={() => scrollToSection("dress-code")}
              className="hover:underline whitespace-nowrap"
            >
              DRESS CODE
            </button>
            <button
              onClick={() => scrollToSection("registry")}
              className="hover:underline"
            >
              REGISTRY
            </button>
          </>
        );
    }
  };

  return (
    <nav
      ref={headerRef}
      className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-4"
    >
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
              className="h-8 md:h-10 w-auto"
            />
          </button>
        </div>

        {/* Middle: Menu items */}
        <div className="flex gap-6 text-sm uppercase tracking-wider justify-center">
          {renderMenuItems()}
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
    </nav>
  );
}
