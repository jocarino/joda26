"use client";

import { Location } from "@/types/rsvp";
import Link from "next/link";

interface LocationNavProps {
  currentLocation: Location;
  allowedLocations: Location[];
  code?: string;
}

const locationNames: Record<Location, string> = {
  Lagos: "Lagos",
  London: "London",
  Portugal: "Portugal",
};

export default function LocationNav({
  currentLocation,
  allowedLocations,
  code,
}: LocationNavProps) {
  // Only show navigation if user has access to multiple locations
  if (allowedLocations.length <= 1) {
    return null;
  }

  const otherLocations = allowedLocations.filter(
    (loc) => loc !== currentLocation
  );

  if (otherLocations.length === 0) {
    return null;
  }

  return (
    <div className="py-8 text-center border-t border-b border-gray-300">
      <p className="text-sm uppercase tracking-wider mb-4 text-gray-600">
        Other Locations
      </p>
      <div className="flex justify-center gap-6 flex-wrap">
        {otherLocations.map((location) => {
          const href = code
            ? `/?code=${code}&location=${location}`
            : `/?location=${location}`;
          return (
            <Link
              key={location}
              href={href}
              className="text-sm uppercase tracking-wider hover:underline transition-colors"
            >
              {locationNames[location]}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
