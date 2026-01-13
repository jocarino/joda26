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
              <p className="text-lg font-semibold mb-2">
                The Grandeur Events Center
              </p>
              <p className="text-sm text-gray-600">Lagos, Nigeria</p>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.331606118743!2d3.3662042!3d6.6056516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b924e6ea69d8f%3A0xfc7043206f1602ae!2sThe%20Grandeur%20Events%20Center!5e0!3m2!1sen!2suk!4v1768342288718!5m2!1sen!2suk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
                title="The Grandeur Events Center Location"
              />
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600 mb-2">ADDRESS</p>
              <p className="text-sm text-gray-600 mb-6">
                17 Billings Way, Oregun, Ikeja 101233, Lagos, Nigeria
              </p>
              <a
                href="https://maps.app.goo.gl/2ykqwvnh6nYT2HW6A?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg mb-1">12:00 PM</p>
            <p className="text-sm uppercase tracking-wider">Starting Time</p>
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
                For getting around Lagos, Uber and Bolt are convenient options.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                We recommend allowing extra travel time due to Lagos traffic.
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
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">
                Colour of the Day & Asoebi
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                The official colour of the day is{" "}
                <span className="font-semibold">Olive Green</span>.
              </p>
              <p className="text-sm text-gray-700">
                We kindly ask that guests only wear Olive Green.
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4 text-center">
                For anyone interested in Asoebi (Optional):
              </h4>
              <div className="space-y-3 max-w-md mx-auto">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Asooke (Pele & Gele):</span>
                  <span className="text-sm font-semibold">₦35,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cap:</span>
                  <span className="text-sm font-semibold">₦2,500</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-3 text-center">
                For delivery within Lagos:
              </h4>
              <p className="text-sm text-gray-700 text-center mb-2">
                Please add <span className="font-semibold">₦5,000</span> and
                include your delivery address with your proof of payment.
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold mb-4 text-center">
                Payment Details:
              </h4>
              <div className="space-y-2 max-w-md mx-auto text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account No:</span>
                  <span className="font-semibold">0793202713</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-semibold">Access Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">Olaleye Oluwadamola</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-700 mb-2">
                Please send proof of payment to:
              </p>
              <a
                href="https://wa.me/447904872478"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline inline-block"
              >
                wa.me/447904872478
              </a>
            </div>
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
            <p className="text-sm text-gray-600 mb-4 text-justify">
              As we will be travelling back to the UK shortly after the
              celebration, we will unfortunately be unable to transport physical
              or boxed gifts. Your presence at our wedding would mean the world
              to us, but for guests who wish to honour us with a gift we would
              appreciate monetary gifts as they will be much easier for us to
              receive and carry with us.
            </p>
            <p className="text-sm text-gray-600 mb-4 text-justify">
              Kindly find our account details below.Thank you for your love,
              generosity, and for celebrating this special moment with us.
            </p>
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
