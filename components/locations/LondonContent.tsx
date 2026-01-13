import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import LocationNav from "@/components/LocationNav";
import HeroSection from "@/components/HeroSection";
import { Location, Guest } from "@/types/rsvp";

interface LondonContentProps {
  inviteCode?: string;
  guest?: Guest;
}

export default function LondonContent({
  inviteCode,
  guest,
}: LondonContentProps) {
  // Create date in local timezone to avoid timezone issues
  const weddingDate = new Date(2026, 3, 25); // April 25, 2026 (month is 0-indexed, so 3 = April)
  const images: string[] = []; // Add image URLs

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        date="April 25th 2026"
        images={images}
        altText="London wedding"
      />

      {/* Schedule & Times */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-wider mb-4 text-center">
            HERE&apos;S A SNEAK PEEK OF
          </p>
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center font-normal">
            OUR SPECIAL DAY&apos;S SCHEDULE
          </h2>
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <span className="text-2xl font-bold">4:00 PM</span>
              <span className="text-lg uppercase tracking-wider">CEREMONY</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <span className="text-2xl font-bold">5:00 PM</span>
              <span className="text-lg uppercase tracking-wider">COCKTAIL</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
              <span className="text-2xl font-bold">6:30 PM</span>
              <span className="text-lg uppercase tracking-wider">DINNER</span>
            </div>
            <div className="flex justify-between items-center pb-4">
              <span className="text-2xl font-bold">10:00 PM</span>
              <span className="text-lg uppercase tracking-wider">
                DANCING & FIREWORKS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="location" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            LOCATIONS
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ceremony Venue</h3>
              <p className="text-sm text-gray-600">Venue name and address</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Reception Venue</h3>
              <p className="text-sm text-gray-600">Venue name and address</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            GETTING THERE
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Airports</h3>
              <p className="text-sm text-gray-600">
                Heathrow (LHR), Gatwick (LGW), or City (LCY)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Transportation</h3>
              <p className="text-sm text-gray-600">
                Details about transportation options...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            RSVP
          </h2>
          <RSVPForm location="London" inviteCode={inviteCode} guest={guest} />
          {/* Debug: Check guest prop */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-4 bg-gray-100 text-xs">
              <strong>Debug:</strong> guest=
              {guest
                ? JSON.stringify(
                    {
                      name: guest.name,
                      allowed_plus_ones: guest.allowed_plus_ones,
                    },
                    null,
                    2
                  )
                : "undefined"}
            </div>
          )}
        </div>
      </section>

      {/* Countdown */}
      <Countdown targetDate={weddingDate.getTime()} />

      {/* Dress Code */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            DRESS CODE
          </h2>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Formal attire requested. Black tie optional.
            </p>
          </div>
        </div>
      </section>

      {/* Registry */}
      <section id="registry" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            REGISTRY
          </h2>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Your presence is the greatest gift, but if you wish to honor us
              with a gift...
            </p>
            <p className="text-sm">Registry information and links...</p>
          </div>
        </div>
      </section>

      {/* Location Navigation */}
      {guest && (
        <LocationNav
          currentLocation="London"
          allowedLocations={guest.allowed_locations}
          code={inviteCode}
        />
      )}
    </div>
  );
}
