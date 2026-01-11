import { Guest } from "@/types/rsvp";
import { fetchGuestByCode } from "./airtable";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || "10", 10);
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10); // 15 minutes

function getRateLimitKey(ip: string): string {
  return `rate_limit:${ip}`;
}

function cleanupExpiredEntries() {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, entry] of entries) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(ip: string): boolean {
  cleanupExpiredEntries();

  const key = getRateLimitKey(ip);
  const entry = rateLimitStore.get(key);
  const now = Date.now();

  if (!entry || entry.resetAt < now) {
    // Reset or create new entry
    rateLimitStore.set(key, {
      count: 0,
      resetAt: now + WINDOW_MS,
    });
    return true;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false;
  }

  return true;
}

export function recordAttempt(ip: string): void {
  cleanupExpiredEntries();

  const key = getRateLimitKey(ip);
  const entry = rateLimitStore.get(key);
  const now = Date.now();

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
  } else {
    entry.count += 1;
  }
}

export async function validateCode(
  code: string,
  ip: string
): Promise<Guest | null> {
  console.log(
    `[validateCode] Starting validation for code: ${code}, IP: ${ip}`
  );

  // Rate limit check
  const rateLimitAllowed = checkRateLimit(ip);
  console.log(
    `[validateCode] Rate limit check: ${
      rateLimitAllowed ? "allowed" : "blocked"
    }`
  );

  if (!rateLimitAllowed) {
    console.log(`[validateCode] Rate limit exceeded for IP: ${ip}`);
    throw new Error("Too many validation attempts. Please try again later.");
  }

  // Format validation - normalize to uppercase
  const normalizedCode = code.toUpperCase().trim();
  console.log(`[validateCode] Normalized code: ${normalizedCode}`);

  const formatValid = /^[A-Z2-9]{8}$/.test(normalizedCode);
  console.log(
    `[validateCode] Format validation: ${formatValid ? "valid" : "invalid"}`
  );

  if (!formatValid) {
    console.log(
      `[validateCode] Invalid code format: ${code} (normalized: ${normalizedCode})`
    );
    recordAttempt(ip); // Count invalid format attempts
    return null;
  }

  // Fetch from Airtable with normalized code
  console.log(
    `[validateCode] Fetching guest from Airtable for code: ${normalizedCode}`
  );
  const guest = await fetchGuestByCode(normalizedCode);

  if (!guest) {
    console.log(`[validateCode] Guest not found for code: ${normalizedCode}`);
    recordAttempt(ip); // Count failed lookups
  } else {
    console.log(
      `[validateCode] Guest found: ${guest.name} with code: ${guest.invite_code}`
    );
    console.log(
      `[validateCode] Guest allowed locations:`,
      guest.allowed_locations
    );
  }

  return guest;
}
