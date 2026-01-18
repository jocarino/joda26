"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Location } from "@/types/rsvp";

interface SingleLocationSyncProps {
  location: Location;
  code?: string;
}

export default function SingleLocationSync({
  location,
  code,
}: SingleLocationSyncProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentLocation = searchParams.get("location");
    const currentCode = searchParams.get("code");

    // Only update URL if location param is missing or doesn't match
    if (currentLocation !== location || (code && currentCode !== code)) {
      const params = new URLSearchParams();
      if (code) {
        params.set("code", code);
      }
      params.set("location", location);
      router.replace(`/?${params.toString()}`, { scroll: false });
    }
  }, [location, code, router, searchParams]);

  return null;
}
