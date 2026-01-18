import Image from "next/image";
import Countdown from "@/components/Countdown";
import RSVPForm from "@/components/RSVPForm";
import HeroSection from "@/components/HeroSection";
import Registry from "@/components/Registry";
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection date="May 2nd 2026" altText="Portugal wedding" />

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
                Boavista Golf & Spa Resort
              </p>
              <p className="text-sm text-gray-600">Lagos, Portugal</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3182.1190506402113!2d-8.706422810977466!3d37.10228350971139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b3107836f11af%3A0xc25eedf65ce11295!2sBoavista%20Golf%20%26%20Spa%20Resort!5e0!3m2!1sen!2suk!4v1768737643555!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="Boavista Golf & Spa Resort Location"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm text-gray-600 mb-6">
                Boavista Golf & Spa Resort, Lagos, Portugal
              </p>
              <a
                href="https://maps.app.goo.gl/?link=https://www.google.com/maps/place/Boavista%20Golf%20%26%20Spa%20Resort/@37.1022835,-8.7064228,17z/data%3D!3m1!4b1!4m6!3m5!1s0xd1b3107836f11af:0xc25eedf65ce11295!8m2!3d37.1022835!4d-8.704248!16s%2Fg%2F11c0vqjqjz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg mb-1">3:30 PM</p>
            <p className="text-sm uppercase tracking-wider">Ceremony</p>
          </div>
        </div>
      </section>

      {/* Getting There */}
      <section className="py-16 px-4 bg-[#5a6134] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            GETTING THERE
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Airport to Fly In</h3>
              <p className="text-sm text-white/90">Faro Airport (FAO)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Transportation</h3>
              <p className="text-sm text-white/90 mb-2">
                <a
                  href="https://www.faroairport.pt/en/fao/access-parking/getting-to-and-from-the-airport/public-transportation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white underline hover:text-white/80"
                >
                  Official Airport Transportation information
                </a>
                : here you can find taxi transfers, bus, trains and others
                transport options to Lagos.
              </p>
              <p className="text-sm text-white/90">
                For getting around Lagos, Uber and Bolt are convenient options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="accommodation" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            ACCOMMODATION
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Guest Rate</h3>
              <p className="text-sm text-gray-600 mb-4">
                We have secured special rates at the{" "}
                <a
                  href="https://www.boavistaresort.pt/en/Homepage.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#5a6134] underline"
                >
                  Boavista Golf & Spa Resort
                </a>
                .
              </p>

              <div className="gap-1 mt-2">
                <div className="w-full relative aspect-video rounded shadow-sm overflow-hidden">
                  <p className="text-sm text-gray-600 mb-2">
                    When you book your stay, after selecting the dates and
                    clicking on <strong className="uppercase">Book now</strong>,
                    please use the code: WEDBC, as shown in the screenshot
                    below.
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    You&apos;ll need to expand the &quot;modify search&quot;.
                  </p>
                  <Image
                    src="/images/Screenshot 2026-01-18 at 12.12.25.png"
                    alt="Boavista Golf & Spa Resort guest rate information"
                    fill
                    className="object-contain rounded"
                  />
                </div>
                <div className="w-full relative aspect-video rounded shadow-sm overflow-hidden mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    On the box that says &quot;Promotional Code&quot;, enter the
                    code: WEDBC.
                  </p>
                  <Image
                    src="/images/Screenshot 2026-01-18 at 12.13.34.png"
                    alt="Boavista Golf & Spa Resort booking details"
                    fill
                    className="object-contain rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section id="dress-code" className="pb-16 pt-0 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="whitespace-nowrap text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            DRESS CODE
          </h2>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Semi formal: dresses and suits.
            </p>
            <p className="text-sm text-gray-600">
              So we can all look dandy and fancy! 💃🕺
            </p>
          </div>
        </div>
      </section>

      {/* Registry */}
      <section id="registry" className="py-16 px-4 bg-[#5a6134] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center font-normal">
            REGISTRY
          </h2>
          <Registry variant="secondary" />
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-16 px-4 bg-white">
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
    </div>
  );
}
