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
  const allowedPlusOnes = guest?.allowed_plus_ones;
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
    attending: true,
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
              attending: rsvp.attending !== false,
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
                  attending: rsvp.attending !== false,
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
            attending: true,
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
                Guest Names
              </label>
              {Array.from({ length: formData.plus_one_count }, (_, i) => (
                <div key={i}>
                  <label
                    htmlFor={`plus_one_${i}`}
                    className="block text-xs uppercase tracking-wider mb-1 text-gray-600"
                  >
                    Guest {i + 1}
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
                    className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter name"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.attending}
                onChange={(e) =>
                  setFormData({ ...formData, attending: e.target.checked })
                }
                className="w-4 h-4 border-gray-300"
              />
              <span className="text-sm uppercase tracking-wider">
                I will be attending
              </span>
            </label>
          </div>
        </>
      )}

      {location === "Portugal" && !simple && (
        <>
          <div>
            <label
              htmlFor="dietary_restrictions"
              className="block text-sm uppercase tracking-wider mb-2"
            >
              Food Allergies or Dietary Restrictions
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
              className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
              placeholder="Please let us know about any dietary requirements..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.visa_required}
                onChange={(e) =>
                  setFormData({ ...formData, visa_required: e.target.checked })
                }
                className="w-4 h-4 border-gray-300"
              />
              <span className="text-sm uppercase tracking-wider">
                I require a visa
              </span>
            </label>
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
        disabled={submitting || (!simple && !formData.name)}
        className="w-full px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
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
