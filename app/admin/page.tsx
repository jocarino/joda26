"use client";

import { useState, useEffect } from "react";
import { Guest, RSVP, Location } from "@/types/rsvp";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | "all">(
    "all"
  );
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const [generatingAllCodes, setGeneratingAllCodes] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState("");
  const [selectedGuestLocations, setSelectedGuestLocations] = useState<Location[]>([]);
  const [activeTab, setActiveTab] = useState<"guests" | "rsvps">("guests");

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setAuthenticated(true);
      loadData();
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    // When switching location, refetch RSVPs server-side so each location is truly separated
    loadRSVPs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: In production, implement proper server-side authentication
    // For now, using a simple client-side check
    // The actual password should be verified server-side
    try {
      const response = await fetch("/api/admin/guests", {
        headers: { Authorization: `Bearer ${password}` },
      });
      
      if (response.ok) {
        setAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", password);
        loadData();
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  const loadRSVPs = async () => {
    setLoading(true);
    try {
      const storedPassword = sessionStorage.getItem("admin_password") || "";
      const locationQuery =
        selectedLocation === "all"
          ? ""
          : `?location=${encodeURIComponent(selectedLocation)}`;

      const rsvpsRes = await fetch(`/api/admin/rsvps${locationQuery}`, {
        headers: { Authorization: `Bearer ${storedPassword}` },
      });

      if (rsvpsRes.ok) {
        const rsvpsData = await rsvpsRes.json();
        setRsvps(rsvpsData.rsvps || []);
      }
    } catch (error) {
      console.error("Error loading RSVPs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Get password from sessionStorage or prompt
      const storedPassword = sessionStorage.getItem("admin_password") || "";
      const locationQuery =
        selectedLocation === "all"
          ? ""
          : `?location=${encodeURIComponent(selectedLocation)}`;
      
      const [guestsRes, rsvpsRes] = await Promise.all([
        fetch("/api/admin/guests", {
          headers: { Authorization: `Bearer ${storedPassword}` },
        }),
        fetch(`/api/admin/rsvps${locationQuery}`, {
          headers: { Authorization: `Bearer ${storedPassword}` },
        }),
      ]);

      if (guestsRes.ok) {
        const guestsData = await guestsRes.json();
        setGuests(guestsData.guests || []);
      }

      if (rsvpsRes.ok) {
        const rsvpsData = await rsvpsRes.json();
        setRsvps(rsvpsData.rsvps || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async (recordId: string) => {
    setGeneratingCode(recordId);
    console.log("[Admin] Generating code for recordId:", recordId);
    
    try {
      const storedPassword = sessionStorage.getItem("admin_password") || "";
      console.log("[Admin] Making request to /api/generate-code");
      
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedPassword}`,
        },
        body: JSON.stringify({ recordId }),
      });

      console.log("[Admin] Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("[Admin] Code generated successfully:", data);
        await loadData();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          `Failed to generate code (Status: ${response.status})`;
        console.error("[Admin] Error response:", errorData);
        console.error("[Admin] Error message:", errorMessage);
        alert(`Failed to generate code: ${errorMessage}`);
      }
    } catch (error: any) {
      console.error("[Admin] Error generating code:", error);
      console.error("[Admin] Error details:", error.message, error.stack);
      alert(`Failed to generate code: ${error.message || "Unknown error"}`);
    } finally {
      setGeneratingCode(null);
    }
  };

  const generateAllMissingCodes = async () => {
    const guestsWithoutCodes = filteredGuests.filter((guest) => !guest.invite_code);
    
    if (guestsWithoutCodes.length === 0) {
      alert("All guests already have codes!");
      return;
    }

    const confirmed = confirm(
      `Generate codes for ${guestsWithoutCodes.length} guest(s)?`
    );
    if (!confirmed) return;

    setGeneratingAllCodes(true);
    const storedPassword = sessionStorage.getItem("admin_password") || "";
    let successCount = 0;
    let failCount = 0;

    for (const guest of guestsWithoutCodes) {
      try {
        const response = await fetch("/api/generate-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedPassword}`,
          },
          body: JSON.stringify({ recordId: guest.id }),
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to generate code for ${guest.name}`);
        }
      } catch (error) {
        failCount++;
        console.error(`Error generating code for ${guest.name}:`, error);
      }
    }

    await loadData();
    setGeneratingAllCodes(false);

    if (failCount === 0) {
      alert(`Successfully generated ${successCount} code(s)!`);
    } else {
      alert(
        `Generated ${successCount} code(s), ${failCount} failed. Check console for details.`
      );
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    showToast("Link copied!");
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (Array.isArray(value)) return `"${value.join('; ')}"`;
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Normalize string by removing accents/diacritics
  const normalizeString = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // RSVPs are filtered server-side by location, then client-side by search query
  const filteredRSVPs = rsvps.filter((rsvp) => {
    // Filter by search query (name) - normalized to handle accents
    if (rsvpSearchQuery && !normalizeString(rsvp.name).includes(normalizeString(rsvpSearchQuery))) {
      return false;
    }
    return true;
  });

  // Filter guests by search query and locations
  const filteredGuests = guests.filter((guest) => {
    // Filter by search query (name) - normalized to handle accents
    if (searchQuery && !normalizeString(guest.name).includes(normalizeString(searchQuery))) {
      return false;
    }
    
    // Filter by locations
    if (selectedGuestLocations.length > 0) {
      const hasMatchingLocation = selectedGuestLocations.some((location) =>
        guest.allowed_locations.includes(location)
      );
      if (!hasMatchingLocation) {
        return false;
      }
    }
    
    return true;
  });

  const toggleGuestLocation = (location: Location) => {
    setSelectedGuestLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 border border-gray-300 max-w-md w-full">
          <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full px-4 py-2 border border-gray-300 mb-4 focus:outline-none focus:border-black"
            required
          />
          <button
            type="submit"
            className="w-full px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-wider"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 text-sm animate-fade-in z-50">
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('admin_authenticated');
              sessionStorage.removeItem('admin_password');
              setAuthenticated(false);
            }}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("guests")}
            className={`px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
              activeTab === "guests"
                ? "border-b-2 border-black font-medium"
                : "text-gray-600 hover:text-black"
            }`}
          >
            Guests
          </button>
          <button
            onClick={() => setActiveTab("rsvps")}
            className={`px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
              activeTab === "rsvps"
                ? "border-b-2 border-black font-medium"
                : "text-gray-600 hover:text-black"
            }`}
          >
            RSVPs
          </button>
        </div>

        {/* Guests Section */}
        {activeTab === "guests" && (
        <section className="bg-white p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif">Guests</h2>
            <div className="flex gap-2">
              {filteredGuests.filter((g) => !g.invite_code).length > 0 && (
                <button
                  onClick={generateAllMissingCodes}
                  disabled={generatingAllCodes}
                  className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors uppercase text-sm disabled:opacity-50"
                >
                  {generatingAllCodes
                    ? "Generating..."
                    : `Generate All Codes (${filteredGuests.filter((g) => !g.invite_code).length})`}
                </button>
              )}
              <button
                onClick={() => exportToCSV(filteredGuests, 'guests.csv')}
                className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="mb-4 flex gap-4 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-black flex-1 max-w-md"
            />
            <div className="flex gap-4 items-center">
              <span className="text-sm text-gray-600">Filter by location:</span>
              <div className="flex gap-2">
                {(["Lagos", "London", "Portugal"] as Location[]).map((location) => (
                  <label key={location} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGuestLocations.includes(location)}
                      onChange={() => toggleGuestLocation(location)}
                      className="cursor-pointer"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
              {selectedGuestLocations.length > 0 && (
                <button
                  onClick={() => setSelectedGuestLocations([])}
                  className="text-xs text-gray-600 hover:text-black underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Code</th>
                    <th className="text-left py-2">Locations</th>
                    <th className="text-left py-2">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b border-gray-100">
                      <td className="py-2">{guest.name}</td>
                      <td className="py-2 font-mono">
                        {guest.invite_code || (
                          <button
                            onClick={() => generateCode(guest.id)}
                            disabled={generatingCode === guest.id}
                            className="text-blue-600 hover:underline text-xs disabled:opacity-50"
                          >
                            {generatingCode === guest.id
                              ? "Generating..."
                              : "Generate Code"}
                          </button>
                        )}
                      </td>
                      <td className="py-2">
                        {guest.allowed_locations.join(", ") || "-"}
                      </td>
                      <td className="py-2">
                        {guest.unique_link ? (
                          <button
                            onClick={() => copyLink(guest.unique_link!)}
                            className="text-blue-600 hover:underline text-xs"
                          >
                            Copy Link
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredGuests.length === 0 && (
                <p className="text-center py-8 text-gray-500">No guests found</p>
              )}
            </div>
          )}
        </section>
        )}

        {/* RSVPs Section */}
        {activeTab === "rsvps" && (
        <section className="bg-white p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif">RSVPs</h2>
            <div className="flex gap-4 items-center">
              <select
                value={selectedLocation}
                onChange={(e) =>
                  setSelectedLocation(e.target.value as Location | "all")
                }
                className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-black"
              >
                <option value="all">All Locations</option>
                <option value="Lagos">Lagos</option>
                <option value="London">London</option>
                <option value="Portugal">Portugal</option>
              </select>
              <button
                onClick={() =>
                  exportToCSV(filteredRSVPs, `rsvps-${selectedLocation}.csv`)
                }
                className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-sm"
              >
                Export CSV
              </button>
            </div>
          </div>
          
          {/* Search Control */}
          <div className="mb-4">
            <input
              type="text"
              value={rsvpSearchQuery}
              onChange={(e) => setRsvpSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="px-4 py-2 border border-gray-300 focus:outline-none focus:border-black max-w-md"
            />
          </div>
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Location</th>
                    <th className="text-left py-2">Guests</th>
                    <th className="text-left py-2">Attending</th>
                    <th className="text-left py-2">Dietary</th>
                    <th className="text-left py-2">Visa</th>
                    <th className="text-left py-2">Accommodation</th>
                    <th className="text-left py-2">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRSVPs.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b border-gray-100">
                      <td className="py-2">{rsvp.name}</td>
                      <td className="py-2">{rsvp.location}</td>
                      <td className="py-2">{rsvp.guests}</td>
                      <td className="py-2">{rsvp.attending ? "Yes" : "No"}</td>
                      <td className="py-2">
                        {rsvp.dietary_restrictions || "-"}
                      </td>
                      <td className="py-2">{rsvp.visa_required ? "Yes" : "-"}</td>
                      <td className="py-2">
                        {rsvp.accommodation_needed ? "Yes" : "-"}
                      </td>
                      <td className="py-2 text-xs">
                        {rsvp.submitted_at
                          ? new Date(rsvp.submitted_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRSVPs.length === 0 && (
                <p className="text-center py-8 text-gray-500">No RSVPs found</p>
              )}
            </div>
          )}
        </section>
        )}
      </div>
    </div>
  );
}

