import { Suspense } from "react";
import LagosContent from "@/components/locations/LagosContent";
import LondonContent from "@/components/locations/LondonContent";
import PortugalContent from "@/components/locations/PortugalContent";
import MultiLocationContent from "@/components/MultiLocationContent";
import CodeInput from "@/components/CodeInput";
import Header from "@/components/Header";
import { Guest, Location } from "@/types/rsvp";
import { fetchGuestByCode } from "@/lib/airtable";

interface PageProps {
  searchParams: Promise<{ code?: string; location?: string }>;
}

async function getGuest(code: string): Promise<Guest | null> {
  try {
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase().trim();

    // Validate format first
    if (!/^[A-Z2-9]{8}$/.test(normalizedCode)) {
      console.log(`Invalid code format on main page: ${code}`);
      return null;
    }

    const guest = await fetchGuestByCode(normalizedCode);
    if (guest) {
      console.log(`Guest found on main page: ${guest.name}`);
    } else {
      console.log(`Guest not found on main page for code: ${normalizedCode}`);
    }
    return guest;
  } catch (error) {
    console.error("Error fetching guest:", error);
    return null;
  }
}

function ContentRenderer({
  code,
  locationParam,
  guest,
}: {
  code?: string;
  locationParam?: string;
  guest?: Guest | null;
}) {
  // Default: Show Lagos with simple RSVP
  if (!code || !guest) {
    return <LagosContent simpleRSVP={true} />;
  }

  // If guest has access to multiple locations, show multi-location view
  if (guest.allowed_locations.length > 1) {
    return (
      <MultiLocationContent
        allowedLocations={guest.allowed_locations}
        inviteCode={code}
        guest={guest}
        initialLocation={locationParam}
      />
    );
  }

  // If only one location, show that location's content
  const displayLocation = guest.allowed_locations[0];

  switch (displayLocation) {
    case "London":
      console.log("[ContentRenderer] Rendering LondonContent with guest:", {
        name: guest.name,
        allowed_plus_ones: guest.allowed_plus_ones,
      });
      return <LondonContent inviteCode={code} guest={guest} />;
    case "Portugal":
      console.log("[ContentRenderer] Rendering PortugalContent with guest:", {
        name: guest.name,
        allowed_plus_ones: guest.allowed_plus_ones,
      });
      return <PortugalContent inviteCode={code} guest={guest} />;
    case "Lagos":
    default:
      console.log("[ContentRenderer] Rendering LagosContent with guest:", {
        name: guest.name,
        allowed_plus_ones: guest.allowed_plus_ones,
      });
      return <LagosContent inviteCode={code} guest={guest} />;
  }
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const code = params.code?.toUpperCase().trim();
  const locationParam = params.location;

  let guest: Guest | null = null;
  if (code && /^[A-Z2-9]{8}$/.test(code)) {
    guest = await getGuest(code);
  }

  return (
    <main className="min-h-screen">
      {/* Navigation Header */}
      <Header />

      {/* Code Input Section (only show if no valid code) */}
      {(!code || !guest) && code !== undefined && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-8">
              ENTER YOUR INVITE CODE
            </h2>
            <CodeInput />
            {code && !guest && (
              <p className="mt-4 text-sm text-red-600">
                Invalid code. Please check and try again, or continue to view
                Lagos information.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <ContentRenderer
          code={code}
          locationParam={locationParam}
          guest={guest}
        />
      </Suspense>
    </main>
  );
}
