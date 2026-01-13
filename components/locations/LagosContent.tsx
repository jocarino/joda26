import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import HeroSection from "@/components/HeroSection";
import { Location, Guest } from "@/types/rsvp";

interface LagosContentProps {
  inviteCode?: string;
  simpleRSVP?: boolean;
  guest?: Guest;
}

export default function LagosContent({
  inviteCode,
  simpleRSVP = false,
  guest,
}: LagosContentProps) {
  // Create date in local timezone to avoid timezone issues
  const weddingDate = new Date(2026, 2, 27); // March 27, 2026 (month is 0-indexed, so 2 = March)
  const images: string[] = []; // Add image URLs

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        date="March 27th 2026"
        images={images}
        altText="Lagos wedding"
      />

      {/* Location & Time */}
      <section id="location" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            LOCATION
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">VENUE NAME</p>
              <p className="text-sm text-gray-600">Lagos, Nigeria</p>
            </div>
            <div className="aspect-video bg-gray-200 grayscale">
              {/* Venue image placeholder */}
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm">Lagos, Nigeria</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg mb-2">4:00 PM</p>
            <p className="text-sm uppercase tracking-wider">Ceremony</p>
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
              <h3 className="text-lg font-semibold mb-2">Airport to Fly In</h3>
              <p className="text-sm text-gray-600">
                Murtala Muhammed International Airport (LOS)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Transportation</h3>
              <p className="text-sm text-gray-600">
                Details about transportation from airport to venue...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Colour Code & Asoebi Details */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            COLOUR CODE & ASOEBI
          </h2>
          <div className="space-y-4 text-center">
            <p className="text-sm text-gray-600">
              We invite you to dress in our wedding colours...
            </p>
            <p className="text-sm">
              Asoebi details and contact information for ordering...
            </p>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <Countdown targetDate={weddingDate.getTime()} />

      {/* Registry */}
      <section id="registry" className="py-16 px-4">
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

      {/* RSVP */}
      <section id="rsvp" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            RSVP
          </h2>
          <RSVPForm
            location="Lagos"
            inviteCode={inviteCode}
            simple={simpleRSVP}
            guest={guest}
          />
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
    </div>
  );
}
