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

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
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

  // RSVPs are now filtered server-side via /api/admin/rsvps?location=...
  const filteredRSVPs = rsvps;

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

        {/* Guests Section */}
        <section className="bg-white p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif">Guests</h2>
            <button
              onClick={() => exportToCSV(guests, 'guests.csv')}
              className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-sm"
            >
              Export CSV
            </button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Code</th>
                    <th className="text-left py-2">Locations</th>
                    <th className="text-left py-2">Link</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr key={guest.id} className="border-b border-gray-100">
                      <td className="py-2">{guest.name}</td>
                      <td className="py-2">{guest.email || "-"}</td>
                      <td className="py-2 font-mono">
                        {guest.invite_code || "-"}
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
                      <td className="py-2">
                        {!guest.invite_code && (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* RSVPs Section */}
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
      </div>
    </div>
  );
}

