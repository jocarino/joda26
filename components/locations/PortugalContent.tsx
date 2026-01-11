import Countdown from "@/components/Countdown";
import ImageGallery from "@/components/ImageGallery";
import RSVPForm from "@/components/RSVPForm";
import LocationNav from "@/components/LocationNav";
import { Guest } from "@/types/rsvp";

interface PortugalContentProps {
  inviteCode?: string;
  guest?: Guest;
}

export default function PortugalContent({
  inviteCode,
  guest,
}: PortugalContentProps) {
  // Create date in local timezone to avoid timezone issues
  const weddingDate = new Date(2026, 4, 2); // May 2, 2026 (month is 0-indexed, so 4 = May)
  const images: string[] = []; // Add image URLs

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-tight font-normal">
            DAMOLA & JOÃO
          </h1>
          <div className="text-5xl md:text-7xl font-bold mb-8 tracking-wider font-sans">
            02 • 05 • 2026
          </div>
          {images.length > 0 && (
            <ImageGallery images={images} alt="Portugal wedding" />
          )}
          <p className="text-sm md:text-base mt-8 max-w-2xl mx-auto font-light tracking-wide">
            JOIN US AS WE EMBARK ON A JOURNEY OF LOVE, JOY, AND ETERNAL
            HAPPINESS.
          </p>
        </div>
      </section>

      {/* Location & Time */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            LOCATION
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">VENUE NAME</p>
              <p className="text-sm text-gray-600">Portugal</p>
            </div>
            <div className="aspect-video bg-gray-200 grayscale">
              {/* Venue image placeholder */}
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm">Portugal</p>
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
              <h3 className="text-lg font-semibold mb-2">Airports</h3>
              <p className="text-sm text-gray-600">
                Lisbon Airport (LIS) or Porto Airport (OPO)
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

      {/* RSVP */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            RSVP
          </h2>
          <RSVPForm location="Portugal" inviteCode={inviteCode} guest={guest} />
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

      {/* Accommodation */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            ACCOMMODATION
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Guest Rate</h3>
              <p className="text-sm text-gray-600 mb-4">
                We have secured special rates at the following hotels...
              </p>
              <p className="text-sm">
                Contact information and booking details...
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hotels Nearby</h3>
              <p className="text-sm text-gray-600">
                Additional hotel recommendations in the area...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown */}
      <Countdown targetDate={weddingDate.getTime()} />

      {/* Dress Code */}
      <section className="py-16 px-4 bg-white">
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
      <section className="py-16 px-4">
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

      {/* Links to Other Locations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 font-normal">
            OTHER LOCATIONS
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="/?location=Lagos"
              className="text-sm uppercase tracking-wider hover:underline"
            >
              Lagos
            </a>
            <a
              href="/?location=London"
              className="text-sm uppercase tracking-wider hover:underline"
            >
              London
            </a>
          </div>
        </div>
      </section>

      {/* Location Navigation */}
      {guest && (
        <LocationNav
          currentLocation="Portugal"
          allowedLocations={guest.allowed_locations}
          code={inviteCode}
        />
      )}
    </div>
  );
}
