"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CodeInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const normalizedCode = code.toUpperCase().trim();
    console.log("[CodeInput] Submitting code:", normalizedCode);
    console.log("[CodeInput] Code length:", normalizedCode.length);

    try {
      const response = await fetch("/api/validate-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: normalizedCode }),
      });

      console.log("[CodeInput] Response status:", response.status);

      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Too many attempts. Please try again later.";
        console.log("[CodeInput] Rate limit error:", errorMessage);
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Invalid code. Please check and try again.";
        console.log(
          "[CodeInput] Validation error:",
          errorMessage,
          "Status:",
          response.status
        );
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log(
        "[CodeInput] Validation successful, guest:",
        data.guest?.name
      );

      if (data.guest) {
        router.push(`/?code=${normalizedCode}`);
      } else {
        console.warn("[CodeInput] No guest in response data:", data);
        setError("Invalid response from server. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("[CodeInput] Network/parsing error:", err);
      console.error("[CodeInput] Error details:", err.message, err.stack);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-4">
        <label
          htmlFor="code"
          className="block text-sm uppercase tracking-wider mb-2"
        >
          Enter Your Invite Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z2-9]/g, "")
                .slice(0, 8)
            );
            setError("");
          }}
          placeholder="K7M9P2Q4"
          maxLength={8}
          className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors text-center tracking-widest uppercase"
          required
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {!error && code.length > 0 && code.length < 8 && (
          <p className="mt-2 text-sm text-gray-500">
            Code must be 8 characters ({code.length}/8)
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || code.length !== 8}
        className="w-full px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
      >
        {loading ? "Validating..." : "Access Your Invitation"}
      </button>
    </form>
  );
}
