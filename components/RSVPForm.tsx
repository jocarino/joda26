"use client";

import { useState, useEffect } from "react";
import { Location, Guest, RSVP } from "@/types/rsvp";

interface RSVPFormProps {
  location: Location;
  inviteCode?: string;
  simple?: boolean;
  guest?: Guest;
}

export default function RSVPForm({
  location,
  inviteCode,
  simple = false,
  guest,
}: RSVPFormProps) {
  // Only show plus ones if explicitly set and greater than 0
  // Handle undefined, null, 0, empty string, or any falsy value
  const allowedPlusOnes = (() => {
    if (!guest) return undefined;

    const locationSpecific =
      location === "Lagos"
        ? guest.allowed_plus_ones_lagos
        : location === "London"
        ? guest.allowed_plus_ones_london
        : guest.allowed_plus_ones_portugal;

    // Prefer location-specific value; fall back to global allowed_plus_ones
    return locationSpecific ?? guest.allowed_plus_ones;
  })();
  const maxPlusOnes =
    allowedPlusOnes !== undefined &&
    allowedPlusOnes !== null &&
    typeof allowedPlusOnes === "number" &&
    allowedPlusOnes > 0
      ? allowedPlusOnes
      : 0;

  // Debug logging
  useEffect(() => {
    console.log("[RSVPForm] Debug Info:", {
      guest: guest,
      guestExists: !!guest,
      guestName: guest?.name,
      allowed_plus_ones: guest?.allowed_plus_ones,
      allowed_plus_onesType: typeof guest?.allowed_plus_ones,
      allowed_plus_onesValue: guest?.allowed_plus_ones,
      allowedPlusOnes,
      maxPlusOnes,
      willShowPlusOnes: maxPlusOnes > 0,
      inviteCode,
      location,
      simple,
    });
  }, [guest, allowedPlusOnes, maxPlusOnes, inviteCode, location, simple]);

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    attending: null as boolean | null,
    dietary_restrictions: "",
    visa_required: false,
    accommodation_needed: false,
    plus_one_count: 0,
    plus_one_names: [] as string[],
  });
  const [existingRSVPId, setExistingRSVPId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch existing RSVP when inviteCode is provided
  useEffect(() => {
    const fetchExistingRSVP = async () => {
      if (!inviteCode || simple) return;

      setLoading(true);
      try {
        const response = await fetch(
          `/api/rsvp?invite_code=${encodeURIComponent(
            inviteCode
          )}&location=${encodeURIComponent(location)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.rsvp) {
            const rsvp = data.rsvp as RSVP;
            console.log("[RSVPForm] Found existing RSVP:", rsvp);
            setExistingRSVPId(rsvp.id);
            setFormData({
              name: rsvp.name || guest?.name || "",
              phone_number: rsvp.phone_number || "",
              attending: rsvp.attending ?? null,
              dietary_restrictions: rsvp.dietary_restrictions || "",
              visa_required: rsvp.visa_required || false,
              accommodation_needed: rsvp.accommodation_needed || false,
              plus_one_count: rsvp.plus_one_names?.length || 0,
              plus_one_names: rsvp.plus_one_names || [],
            });
          } else if (guest?.name) {
            // Pre-fill with guest name if no existing RSVP
            setFormData((prev) => ({
              ...prev,
              name: guest.name,
            }));
          }
        }
      } catch (err) {
        console.error("[RSVPForm] Error fetching existing RSVP:", err);
        // If fetch fails, still pre-fill with guest name if available
        if (guest?.name) {
          setFormData((prev) => ({
            ...prev,
            name: guest.name,
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExistingRSVP();
  }, [inviteCode, location, simple, guest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate attendance is explicitly set
    if (formData.attending === null || formData.attending === undefined) {
      setError("Please select whether you will be attending (Yes or No)");
      return;
    }

    // Validate dietary restrictions for Portugal location
    if (
      location === "Portugal" &&
      !simple &&
      !formData.dietary_restrictions.trim()
    ) {
      setError(
        "Please provide information about food allergies or dietary restrictions"
      );
      return;
    }

    // Validate all guest names are filled when plus ones are selected
    if (
      !simple &&
      formData.plus_one_count > 0 &&
      formData.plus_one_names.some(
        (name, index) => index < formData.plus_one_count && !name.trim()
      )
    ) {
      setError("Please provide names for all guests");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: existingRSVPId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: existingRSVPId,
          invite_code: inviteCode,
          location,
          name: formData.name,
          phone_number:
            location === "Lagos" ? formData.phone_number : undefined,
          guests: formData.plus_one_count + 1, // Main guest + plus ones
          attending: formData.attending,
          dietary_restrictions: formData.dietary_restrictions,
          visa_required: formData.visa_required,
          accommodation_needed: formData.accommodation_needed,
          plus_one_names:
            formData.plus_one_count > 0
              ? formData.plus_one_names.filter((name) => name.trim() !== "")
              : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ error: "Failed to submit RSVP" }));
        throw new Error(data.error || "Failed to submit RSVP");
      }

      setSuccess(true);

      // If there's an inviteCode, re-fetch the RSVP to show updated data
      // Otherwise, reset form after success
      if (inviteCode && !simple) {
        setTimeout(async () => {
          try {
            const response = await fetch(
              `/api/rsvp?invite_code=${encodeURIComponent(
                inviteCode
              )}&location=${encodeURIComponent(location)}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.rsvp) {
                const rsvp = data.rsvp as RSVP;
                setExistingRSVPId(rsvp.id);
                setFormData({
                  name: rsvp.name || guest?.name || "",
                  phone_number: rsvp.phone_number || "",
                  attending: rsvp.attending ?? null,
                  dietary_restrictions: rsvp.dietary_restrictions || "",
                  visa_required: rsvp.visa_required || false,
                  accommodation_needed: rsvp.accommodation_needed || false,
                  plus_one_count: rsvp.plus_one_names?.length || 0,
                  plus_one_names: rsvp.plus_one_names || [],
                });
              }
            }
          } catch (err) {
            console.error(
              "[RSVPForm] Error re-fetching RSVP after submit:",
              err
            );
          }
          setSuccess(false);
        }, 3000);
      } else {
        // Reset form after success for simple forms
        setTimeout(() => {
          setFormData({
            name: "",
            phone_number: "",
            attending: null,
            dietary_restrictions: "",
            visa_required: false,
            accommodation_needed: false,
            plus_one_count: 0,
            plus_one_names: [],
          });
          setSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8 text-center border border-gray-300">
        <p className="text-lg mb-2">Thank you for your RSVP!</p>
        <p className="text-sm text-gray-600">
          {existingRSVPId
            ? "Your RSVP has been updated."
            : "We look forward to celebrating with you."}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-8 text-center border border-gray-300">
        <p className="text-sm text-gray-600">Loading your RSVP...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      {/* Debug indicator - only in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 text-xs space-y-1">
          <div>
            <strong>DEBUG:</strong>
          </div>
          <div>Guest exists: {guest ? "YES" : "NO"}</div>
          {guest && (
            <>
              <div>Guest name: {guest.name}</div>
              <div>
                allowed_plus_ones (raw): {String(guest.allowed_plus_ones)}
              </div>
              <div>
                allowed_plus_ones (type): {typeof guest.allowed_plus_ones}
              </div>
              <div>maxPlusOnes: {maxPlusOnes}</div>
              <div>Will show plus ones: {maxPlusOnes > 0 ? "YES" : "NO"}</div>
            </>
          )}
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-sm uppercase tracking-wider mb-2"
        >
          Name {simple ? "" : "*"}
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required={!simple}
          disabled={!!inviteCode}
          readOnly={!!inviteCode}
          className={`w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors ${
            inviteCode ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      {/* Phone Number - Only show for Lagos */}
      {location === "Lagos" && (
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm uppercase tracking-wider mb-2"
          >
            Phone Number *
          </label>
          <input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            required
            className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            placeholder="+1234567890"
          />
        </div>
      )}

      {/* Attendance - Required on all forms */}
      <div>
        <label className="block text-sm uppercase tracking-wider mb-3">
          Will you be attending? *
        </label>
        <div className="flex gap-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={formData.attending === true}
              onChange={() => setFormData({ ...formData, attending: true })}
              className="w-4 h-4 border-gray-300"
              required
            />
            <span className="text-sm uppercase tracking-wider">Yes</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="attending"
              checked={formData.attending === false}
              onChange={() => setFormData({ ...formData, attending: false })}
              className="w-4 h-4 border-gray-300"
              required
            />
            <span className="text-sm uppercase tracking-wider">No</span>
          </label>
        </div>
      </div>

      {!simple && (
        <>
          {maxPlusOnes > 0 && (
            <>
              <div>
                <label
                  htmlFor="plus_one_count"
                  className="block text-sm uppercase tracking-wider mb-2"
                >
                  Number of Guests *
                </label>
                <select
                  id="plus_one_count"
                  value={formData.plus_one_count}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10) || 0;
                    const newNames = Array(count)
                      .fill("")
                      .map((_, i) => formData.plus_one_names[i] || "");
                    setFormData({
                      ...formData,
                      plus_one_count: count,
                      plus_one_names: newNames,
                    });
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                >
                  {Array.from({ length: maxPlusOnes + 1 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {formData.plus_one_count > 0 && (
            <div className="space-y-4">
              <label className="block text-sm uppercase tracking-wider mb-2">
                Guest Names *
              </label>
              {Array.from({ length: formData.plus_one_count }, (_, i) => (
                <div key={i}>
                  <label
                    htmlFor={`plus_one_${i}`}
                    className="block text-xs uppercase tracking-wider mb-1 text-gray-600"
                  >
                    Guest {i + 1} *
                  </label>
                  <input
                    id={`plus_one_${i}`}
                    type="text"
                    value={formData.plus_one_names[i] || ""}
                    onChange={(e) => {
                      const newNames = [...formData.plus_one_names];
                      newNames[i] = e.target.value;
                      setFormData({ ...formData, plus_one_names: newNames });
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter name"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {location === "Portugal" && !simple && (
        <>
          <div>
            <label
              htmlFor="dietary_restrictions"
              className="block text-sm uppercase tracking-wider mb-2"
            >
              Food Allergies or Dietary Restrictions *
            </label>
            <textarea
              id="dietary_restrictions"
              value={formData.dietary_restrictions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dietary_restrictions: e.target.value,
                })
              }
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
              placeholder="Please let us know about any dietary requirements..."
            />
          </div>
        </>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          submitting ||
          formData.attending === null ||
          (!simple &&
            (!formData.name ||
              (location === "Lagos" && !formData.phone_number) ||
              (location === "Portugal" &&
                !formData.dietary_restrictions.trim()) ||
              (formData.plus_one_count > 0 &&
                formData.plus_one_names.some(
                  (name, index) =>
                    index < formData.plus_one_count && !name.trim()
                ))))
        }
        className="w-full px-6 py-3 border border-[#5a6134] hover:bg-[#5a6134] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
      >
        {submitting
          ? existingRSVPId
            ? "Updating..."
            : "Submitting..."
          : existingRSVPId
          ? "Update RSVP"
          : "Submit RSVP"}
      </button>
    </form>
  );
}
