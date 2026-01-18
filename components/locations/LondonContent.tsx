import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import HeroSection from "@/components/HeroSection";
import Registry from "@/components/Registry";
import { Guest } from "@/types/rsvp";

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection date="April 25th 2026" altText="London wedding" />

      {/* Countdown */}
      <Countdown targetDate={weddingDate.getTime()} />

      {/* Location & Time */}
      <section id="location" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            LOCATION
          </h2>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">
                The Town Hall Reading
              </p>
              <p className="text-sm text-gray-600">Reading, UK</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2486.064929070549!2d-0.972535923379769!3d51.456964314386624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48769b17dcf03d8f%3A0x2fb4bed32240815e!2sThe%20Town%20Hall%20Reading!5e0!3m2!1sen!2suk!4v1768736684401!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="The Town Hall Reading Location"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm text-gray-600 mb-6">
                Blagrave Street, Reading RG1 1QH, UK
              </p>
              <a
                href="https://maps.app.goo.gl/?link=https://www.google.com/maps/place/The%20Town%20Hall%20Reading/@51.4569643,-0.9725359,17z/data%3D!3m1!4b1!4m6!3m5!1s0x48769b17dcf03d8f:0x2fb4bed32240815e!8m2!3d51.4569643!4d-0.970361!16s%2Fg%2F11c0vqjqjz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg mb-1">13:00</p>
            <p className="text-sm uppercase tracking-wider">Ceremony</p>
          </div>

          {/* Lunch Location */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-lg font-semibold mb-2">Lunch Venue: Cosmo</p>
              <p className="text-sm text-gray-600">Reading, UK</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2486.0711652742434!2d-0.9763647233797738!3d51.45684981439493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48769b171697c0e9%3A0x3b6f7a683e134d5a!2sCOSMO%20All%20You%20Can%20Eat%20World%20Buffet%20Restaurant%20%7C%20Reading!5e0!3m2!1sen!2suk!4v1768736812668!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Lunch Venue Location"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm text-gray-600 mb-6">
                35-38 Friar St, Reading RG1 1DX, UK
              </p>
              <a
                href="https://www.google.com/maps/@51.45673573269765,-0.9736645719911801,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm uppercase tracking-wider">Lunch</p>
          </div>
        </div>
      </section>

      {/* Schedule & Times */}
      <section className="py-16 px-4 bg-[#5a6134] text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-wider mb-4 text-center">
            HERE&apos;S A SNEAK PEEK OF
          </p>
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center font-normal">
            OUR SPECIAL DAY&apos;S SCHEDULE
          </h2>
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-white/30 pb-4">
              <span className="text-2xl font-bold">13:00</span>
              <span className="text-lg uppercase tracking-wider">CEREMONY</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/30 pb-4">
              <span className="text-2xl font-bold">13:45</span>
              <span className="text-lg uppercase tracking-wider">LUNCH</span>
            </div>
          </div>
        </div>
      </section>

      {/* Registry */}
      <section id="registry" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            REGISTRY
          </h2>
          <Registry />
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
    </div>
  );
}
