"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LagosContent from "@/components/locations/LagosContent";
import LondonContent from "@/components/locations/LondonContent";
import PortugalContent from "@/components/locations/PortugalContent";
import { Location, Guest } from "@/types/rsvp";

interface MultiLocationContentProps {
  allowedLocations: Location[];
  inviteCode: string;
  guest: Guest;
  initialLocation?: string;
}

const locationNames: Record<Location, string> = {
  Lagos: "Lagos",
  London: "London",
  Portugal: "Portugal",
};

export default function MultiLocationContent({
  allowedLocations,
  inviteCode,
  guest,
  initialLocation,
}: MultiLocationContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine initial location: use URL param if valid, otherwise first allowed location
  const getInitialLocation = (): Location => {
    if (
      initialLocation &&
      ["Lagos", "London", "Portugal"].includes(initialLocation) &&
      allowedLocations.includes(initialLocation as Location)
    ) {
      return initialLocation as Location;
    }
    return allowedLocations[0];
  };

  const [activeLocation, setActiveLocation] = useState<Location>(
    getInitialLocation()
  );

  // Update URL when location changes
  useEffect(() => {
    const code = searchParams.get("code");
    const params = new URLSearchParams();
    if (code) {
      params.set("code", code);
    }
    params.set("location", activeLocation);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [activeLocation, router, searchParams]);

  const renderLocationContent = (location: Location) => {
    switch (location) {
      case "Lagos":
        return <LagosContent inviteCode={inviteCode} guest={guest} />;
      case "London":
        return <LondonContent inviteCode={inviteCode} guest={guest} />;
      case "Portugal":
        return <PortugalContent inviteCode={inviteCode} guest={guest} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Location Tabs */}
      {allowedLocations.length > 1 && (
        <section className="sticky top-[71px] z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center gap-2 md:gap-4 overflow-x-auto">
              {allowedLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => setActiveLocation(location)}
                  className={`px-6 py-4 text-sm uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeLocation === location
                      ? "border-b-2 border-[#5a6134] font-semibold"
                      : "text-gray-600 hover:text-[#5a6134]"
                  }`}
                >
                  {locationNames[location]}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Location Content */}
      <div key={activeLocation}>{renderLocationContent(activeLocation)}</div>
    </div>
  );
}
