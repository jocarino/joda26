import {
  Guest,
  RSVP,
  Location,
  AirtableGuestRecord,
  AirtableRSVPRecord,
} from "@/types/rsvp";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_PAT = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const GUESTS_TABLE = process.env.AIRTABLE_GUESTS_TABLE || "Guests";
const RSVPS_TABLE = process.env.AIRTABLE_RSVPS_TABLE || "RSVPs";

if (!AIRTABLE_BASE_ID || !AIRTABLE_PAT) {
  throw new Error(
    "Missing Airtable configuration. Please set AIRTABLE_BASE_ID and AIRTABLE_PERSONAL_ACCESS_TOKEN environment variables."
  );
}

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

async function airtableRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${AIRTABLE_API_URL}${endpoint}`;
  console.log(`[airtableRequest] Making request to: ${url}`);
  console.log(`[airtableRequest] Method: ${options.method || "GET"}`);

  if (options.body) {
    console.log(`[airtableRequest] Request body:`, options.body);
  }

  const response = await fetch(url, {
    ...options,
    cache: 'no-store', // Disable caching to always get fresh data from Airtable
    headers: {
      Authorization: `Bearer ${AIRTABLE_PAT}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  console.log(
    `[airtableRequest] Response status: ${response.status} ${response.statusText}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[airtableRequest] Error response body:`, errorText);

    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { error: { message: errorText || "Unknown error" } };
    }

    const errorMessage = error?.error?.message || JSON.stringify(error);
    console.error(`[airtableRequest] Parsed error message:`, errorMessage);
    console.error(
      `[airtableRequest] Full error object:`,
      JSON.stringify(error, null, 2)
    );

    // Provide helpful error message for missing fields
    if (errorMessage.includes("UNKNOWN_FIELD_NAME")) {
      const fieldMatch = errorMessage.match(/Unknown field name: "([^"]+)"/);
      if (fieldMatch) {
        const fieldError = `Airtable field "${fieldMatch[1]}" not found. Please check your Airtable table schema and ensure all required fields exist.`;
        console.error(`[airtableRequest] Field error:`, fieldError);
        throw new Error(fieldError);
      }
    }

    // Handle record not found errors
    if (errorMessage.includes("NOT_FOUND") || response.status === 404) {
      const notFoundError = `Record not found in Airtable. Please check the record ID.`;
      console.error(`[airtableRequest] Record not found error:`, notFoundError);
      throw new Error(notFoundError);
    }

    // Handle authentication errors
    if (
      response.status === 401 ||
      errorMessage.includes("AUTHENTICATION_REQUIRED")
    ) {
      const authError = `Airtable authentication failed. Please check your Personal Access Token.`;
      console.error(`[airtableRequest] Authentication error:`, authError);
      throw new Error(authError);
    }

    const apiError = new Error(`Airtable API error: ${errorMessage}`);
    console.error(`[airtableRequest] Throwing error:`, apiError.message);
    throw apiError;
  }

  const data = await response.json();
  console.log(
    `[airtableRequest] Success, records in response: ${
      data.records?.length || "N/A"
    }`
  );
  return data;
}

export async function fetchGuestByCode(code: string): Promise<Guest | null> {
  console.log(`[fetchGuestByCode] Looking up code: ${code}`);
  console.log(
    `[fetchGuestByCode] Table: ${GUESTS_TABLE}, Base ID: ${AIRTABLE_BASE_ID}`
  );

  try {
    // Normalize code to uppercase for consistent querying
    const normalizedCode = code.toUpperCase().trim();

    // Build filter formula - Airtable filter formulas are case-sensitive
    // We'll search for exact match (Airtable should store codes in uppercase)
    const filterFormula = `{invite_code}="${normalizedCode}"`;
    const encodedFormula = encodeURIComponent(filterFormula);

    console.log(`[fetchGuestByCode] Filter formula: ${filterFormula}`);
    console.log(`[fetchGuestByCode] Encoded formula: ${encodedFormula}`);

    const url = `/${GUESTS_TABLE}?filterByFormula=${encodedFormula}`;
    console.log(`[fetchGuestByCode] Request URL: ${AIRTABLE_API_URL}${url}`);

    const data = await airtableRequest(url);

    console.log(
      `[fetchGuestByCode] Response received, records count: ${
        data.records?.length || 0
      }`
    );

    if (data.records && data.records.length > 0) {
      const record = data.records[0] as AirtableGuestRecord;
      console.log(`[fetchGuestByCode] Record found:`, {
        id: record.id,
        invite_code: record.fields.invite_code,
        name: record.fields.name,
        allowed_locations: record.fields.allowed_locations,
      });

      // Double-check the code matches (case-insensitive)
      const recordCode = record.fields.invite_code || "";
      if (recordCode.toUpperCase() !== normalizedCode) {
        console.warn(
          `[fetchGuestByCode] Code mismatch: searched for "${normalizedCode}", found "${recordCode}"`
        );
        return null;
      }

      const rawAllowedPlusOnes = record.fields.allowed_plus_ones;
      console.log(`[fetchGuestByCode] Raw allowed_plus_ones from Airtable:`, {
        value: rawAllowedPlusOnes,
        type: typeof rawAllowedPlusOnes,
        isUndefined: rawAllowedPlusOnes === undefined,
        isNull: rawAllowedPlusOnes === null,
        isNumber: typeof rawAllowedPlusOnes === "number",
        isGreaterThanZero:
          typeof rawAllowedPlusOnes === "number" && rawAllowedPlusOnes > 0,
      });

      const normalizeAllowedPlusOnes = (
        value: unknown
      ): number | undefined => {
        return typeof value === "number" && value > 0 ? value : undefined;
      };

      const guest = {
        id: record.id,
        invite_code: record.fields.invite_code || "",
        name: record.fields.name,
        email: record.fields.email,
        allowed_locations: (record.fields.allowed_locations ||
          []) as Location[],
        code_generated_at: record.fields.code_generated_at,
        // Only include allowed_plus_ones if it's a valid positive number
        allowed_plus_ones: normalizeAllowedPlusOnes(record.fields.allowed_plus_ones),
        allowed_plus_ones_lagos: normalizeAllowedPlusOnes(
          (record.fields as any).allowed_plus_ones_lagos
        ),
        allowed_plus_ones_london: normalizeAllowedPlusOnes(
          (record.fields as any).allowed_plus_ones_london
        ),
        allowed_plus_ones_portugal: normalizeAllowedPlusOnes(
          (record.fields as any).allowed_plus_ones_portugal
        ),
      };

      console.log(`[fetchGuestByCode] Returning guest:`, {
        name: guest.name,
        allowed_plus_ones: guest.allowed_plus_ones,
        allowed_plus_onesType: typeof guest.allowed_plus_ones,
        fullGuest: guest,
      });
      return guest;
    }

    console.log(
      `[fetchGuestByCode] No guest found with code: ${normalizedCode}`
    );
    return null;
  } catch (error: any) {
    console.error("[fetchGuestByCode] Error fetching guest:", error);
    console.error("[fetchGuestByCode] Error message:", error.message);
    console.error("[fetchGuestByCode] Error stack:", error.stack);

    // Check if it's an Airtable API error with more details
    if (error.message) {
      console.error(
        "[fetchGuestByCode] Full error details:",
        JSON.stringify(error, null, 2)
      );
    }

    return null;
  }
}

export async function checkCodeExists(code: string): Promise<boolean> {
  try {
    const normalizedCode = code.toUpperCase().trim();
    const filterFormula = `{invite_code}="${normalizedCode}"`;
    const encodedFormula = encodeURIComponent(filterFormula);

    console.log(`[checkCodeExists] Checking code: ${normalizedCode}`);

    const data = await airtableRequest(
      `/${GUESTS_TABLE}?filterByFormula=${encodedFormula}&maxRecords=1`
    );

    const exists = data.records && data.records.length > 0;
    console.log(`[checkCodeExists] Code ${normalizedCode} exists: ${exists}`);
    return exists;
  } catch (error: any) {
    console.error("[checkCodeExists] Error checking code:", error);
    console.error("[checkCodeExists] Error message:", error.message);
    return false;
  }
}

export async function createGuestCode(
  recordId: string,
  code: string
): Promise<void> {
  console.log(
    `[createGuestCode] Creating code for recordId: ${recordId}, code: ${code}`
  );
  console.log(`[createGuestCode] Table: ${GUESTS_TABLE}`);

  try {
    // Format date as YYYY-MM-DD for Date fields, or ISO string for Date & Time fields
    // Try date-only format first (most common for Date fields)
    const today = new Date();
    const dateOnlyString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const isoString = today.toISOString(); // Full ISO format for Date & Time fields

    const updateData = {
      fields: {
        invite_code: code,
        code_generated_at: dateOnlyString,
      },
    };

    console.log(
      `[createGuestCode] Update payload:`,
      JSON.stringify(updateData, null, 2)
    );

    await airtableRequest(`/${GUESTS_TABLE}/${recordId}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });

    console.log(
      `[createGuestCode] Code created successfully for recordId: ${recordId}`
    );
  } catch (error: any) {
    console.error("[createGuestCode] Error creating guest code:", error);
    console.error("[createGuestCode] Error message:", error.message);
    console.error("[createGuestCode] Error stack:", error.stack);

    // Check if it's a record not found error
    if (error.message && error.message.includes("NOT_FOUND")) {
      throw new Error(
        `Guest record with ID "${recordId}" not found in Airtable`
      );
    }

    // If code_generated_at field is the issue, try again without it
    if (
      error.message &&
      (error.message.includes("code_generated_at") ||
        error.message.includes("cannot accept the provided value"))
    ) {
      console.log(
        "[createGuestCode] code_generated_at field error detected, retrying without date field"
      );
      try {
        const updateDataWithoutDate = {
          fields: {
            invite_code: code,
          },
        };

        console.log(
          `[createGuestCode] Retry payload (without date):`,
          JSON.stringify(updateDataWithoutDate, null, 2)
        );

        await airtableRequest(`/${GUESTS_TABLE}/${recordId}`, {
          method: "PATCH",
          body: JSON.stringify(updateDataWithoutDate),
        });

        console.log(
          `[createGuestCode] Code created successfully (without date) for recordId: ${recordId}`
        );
        return; // Success without date field
      } catch (retryError: any) {
        console.error(
          "[createGuestCode] Error creating guest code (retry without date):",
          retryError
        );
        throw retryError;
      }
    }

    throw error;
  }
}

export async function updateRSVP(rsvpId: string, rsvp: RSVP): Promise<void> {
  try {
    const fields: any = {
      location: rsvp.location,
      name: rsvp.name,
      phone_number: rsvp.phone_number,
      guests: rsvp.guests,
      attending: rsvp.attending,
    };

    if (rsvp.invite_code) {
      fields.invite_code = rsvp.invite_code;
    }

    if (rsvp.dietary_restrictions) {
      fields.dietary_restrictions = rsvp.dietary_restrictions;
    } else {
      // Clear the field if not provided
      fields.dietary_restrictions = null;
    }

    if (rsvp.visa_required !== undefined) {
      fields.visa_required = rsvp.visa_required;
    }

    if (rsvp.accommodation_needed !== undefined) {
      fields.accommodation_needed = rsvp.accommodation_needed;
    }

    if (rsvp.plus_one_names && rsvp.plus_one_names.length > 0) {
      // Store as comma-separated string in Airtable Long text field
      fields.plus_one_names = rsvp.plus_one_names.join(", ");
    } else {
      // Clear the field if no plus ones
      fields.plus_one_names = null;
    }

    // Update submitted_at to current date
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    fields.submitted_at = dateString;

    await airtableRequest(`/${RSVPS_TABLE}/${rsvpId}`, {
      method: "PATCH",
      body: JSON.stringify({
        fields,
      }),
    });

    console.log(`[updateRSVP] RSVP updated successfully: ${rsvpId}`);
  } catch (error: any) {
    console.error("[updateRSVP] Error updating RSVP:", error);
    throw error;
  }
}

export async function createRSVP(rsvp: RSVP): Promise<void> {
  try {
    const fields: any = {
      location: rsvp.location,
      name: rsvp.name,
      phone_number: rsvp.phone_number,
      guests: rsvp.guests,
      attending: rsvp.attending,
    };

    if (rsvp.invite_code) {
      fields.invite_code = rsvp.invite_code;
    }

    if (rsvp.dietary_restrictions) {
      fields.dietary_restrictions = rsvp.dietary_restrictions;
    }

    if (rsvp.visa_required !== undefined) {
      fields.visa_required = rsvp.visa_required;
    }

    if (rsvp.accommodation_needed !== undefined) {
      fields.accommodation_needed = rsvp.accommodation_needed;
    }

    if (rsvp.plus_one_names && rsvp.plus_one_names.length > 0) {
      // Store as comma-separated string in Airtable Long text field
      fields.plus_one_names = rsvp.plus_one_names.join(", ");
    }

    // Only include submitted_at if the field exists and format it correctly for Airtable
    // Airtable Date fields accept ISO date strings (YYYY-MM-DD) or timestamps
    // We'll use the date-only format to avoid timezone issues
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    // Try to include submitted_at, but don't fail if field doesn't exist
    // The field will be included but Airtable will ignore it if the field type is wrong
    fields.submitted_at = dateString;

    await airtableRequest(`/${RSVPS_TABLE}`, {
      method: "POST",
      body: JSON.stringify({
        fields,
      }),
    });
  } catch (error: any) {
    // If submitted_at is the issue, try again without it
    if (error.message && error.message.includes("submitted_at")) {
      try {
        const fieldsWithoutDate: any = {
          location: rsvp.location,
          name: rsvp.name,
          guests: rsvp.guests,
          attending: rsvp.attending,
        };

        if (rsvp.invite_code) {
          fieldsWithoutDate.invite_code = rsvp.invite_code;
        }

        if (rsvp.dietary_restrictions) {
          fieldsWithoutDate.dietary_restrictions = rsvp.dietary_restrictions;
        }

        if (rsvp.visa_required !== undefined) {
          fieldsWithoutDate.visa_required = rsvp.visa_required;
        }

        if (rsvp.accommodation_needed !== undefined) {
          fieldsWithoutDate.accommodation_needed = rsvp.accommodation_needed;
        }

        if (rsvp.plus_one_names && rsvp.plus_one_names.length > 0) {
          // Store as comma-separated string in Airtable Long text field
          fieldsWithoutDate.plus_one_names = rsvp.plus_one_names.join(", ");
        }

        await airtableRequest(`/${RSVPS_TABLE}`, {
          method: "POST",
          body: JSON.stringify({
            fields: fieldsWithoutDate,
          }),
        });
        return; // Success without submitted_at
      } catch (retryError) {
        console.error(
          "Error creating RSVP (retry without submitted_at):",
          retryError
        );
        throw retryError;
      }
    }

    console.error("Error creating RSVP:", error);
    throw error;
  }
}

export async function getAllGuests(): Promise<Guest[]> {
  try {
    const data = await airtableRequest(`/${GUESTS_TABLE}?sort[0][field]=name`);

    const normalizeAllowedPlusOnes = (value: unknown): number | undefined => {
      return typeof value === "number" && value > 0 ? value : undefined;
    };

    return (data.records || []).map((record: AirtableGuestRecord) => ({
      id: record.id,
      invite_code: record.fields.invite_code || "",
      name: record.fields.name,
      email: record.fields.email,
      allowed_locations: (record.fields.allowed_locations || []) as Location[],
      code_generated_at: record.fields.code_generated_at,
      // Global fallback (used when location-specific values are not set)
      allowed_plus_ones: normalizeAllowedPlusOnes(record.fields.allowed_plus_ones),
      // Location-specific values (preferred)
      allowed_plus_ones_lagos: normalizeAllowedPlusOnes(
        (record.fields as any).allowed_plus_ones_lagos
      ),
      allowed_plus_ones_london: normalizeAllowedPlusOnes(
        (record.fields as any).allowed_plus_ones_london
      ),
      allowed_plus_ones_portugal: normalizeAllowedPlusOnes(
        (record.fields as any).allowed_plus_ones_portugal
      ),
    }));
  } catch (error) {
    console.error("Error fetching all guests:", error);
    return [];
  }
}

export async function getRSVPByCodeAndLocation(
  inviteCode: string,
  location: Location
): Promise<RSVP | null> {
  try {
    const normalizedCode = inviteCode.toUpperCase().trim();
    const filterFormula = `AND({invite_code}="${normalizedCode}", {location}="${location}")`;
    const encodedFormula = encodeURIComponent(filterFormula);

    console.log(
      `[getRSVPByCodeAndLocation] Looking up RSVP for code: ${normalizedCode}, location: ${location}`
    );
    console.log(`[getRSVPByCodeAndLocation] Filter formula: ${filterFormula}`);

    const data = await airtableRequest(
      `/${RSVPS_TABLE}?filterByFormula=${encodedFormula}&maxRecords=1`
    );

    if (data.records && data.records.length > 0) {
      const record = data.records[0] as AirtableRSVPRecord;
      console.log(`[getRSVPByCodeAndLocation] RSVP found:`, {
        id: record.id,
        name: record.fields.name,
        location: record.fields.location,
      });

      return {
        id: record.id,
        invite_code: record.fields.invite_code,
        location: record.fields.location as Location,
        name: record.fields.name,
        phone_number: record.fields.phone_number || "",
        guests: record.fields.guests,
        attending: record.fields.attending,
        dietary_restrictions: record.fields.dietary_restrictions,
        visa_required: record.fields.visa_required,
        accommodation_needed: record.fields.accommodation_needed,
        submitted_at: record.fields.submitted_at,
        // Parse comma-separated string back to array
        plus_one_names: record.fields.plus_one_names
          ? typeof record.fields.plus_one_names === "string"
            ? record.fields.plus_one_names
                .split(",")
                .map((name) => name.trim())
                .filter((name) => name !== "")
            : Array.isArray(record.fields.plus_one_names)
            ? record.fields.plus_one_names
            : undefined
          : undefined,
      };
    }

    console.log(
      `[getRSVPByCodeAndLocation] No RSVP found for code: ${normalizedCode}, location: ${location}`
    );
    return null;
  } catch (error) {
    console.error("Error fetching RSVP by code and location:", error);
    return null;
  }
}

export async function getAllRSVPs(): Promise<RSVP[]> {
  try {
    const data = await airtableRequest(
      `/${RSVPS_TABLE}?sort[0][field]=submitted_at&sort[0][direction]=desc`
    );

    return (data.records || []).map((record: AirtableRSVPRecord) => ({
      id: record.id,
      invite_code: record.fields.invite_code,
      location: record.fields.location as Location,
      name: record.fields.name,
      phone_number: record.fields.phone_number || "",
      guests: record.fields.guests,
      attending: record.fields.attending,
      dietary_restrictions: record.fields.dietary_restrictions,
      visa_required: record.fields.visa_required,
      accommodation_needed: record.fields.accommodation_needed,
      submitted_at: record.fields.submitted_at,
      // Parse comma-separated string back to array
      plus_one_names: record.fields.plus_one_names
        ? typeof record.fields.plus_one_names === "string"
          ? record.fields.plus_one_names
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name !== "")
          : Array.isArray(record.fields.plus_one_names)
          ? record.fields.plus_one_names
          : undefined
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching all RSVPs:", error);
    return [];
  }
}

export async function getRSVPsByLocation(location: Location): Promise<RSVP[]> {
  try {
    const filterFormula = `{location}="${location}"`;
    const encodedFormula = encodeURIComponent(filterFormula);

    const data = await airtableRequest(
      `/${RSVPS_TABLE}?filterByFormula=${encodedFormula}&sort[0][field]=submitted_at&sort[0][direction]=desc`
    );

    return (data.records || []).map((record: AirtableRSVPRecord) => ({
      id: record.id,
      invite_code: record.fields.invite_code,
      location: record.fields.location as Location,
      name: record.fields.name,
      phone_number: record.fields.phone_number || "",
      guests: record.fields.guests,
      attending: record.fields.attending,
      dietary_restrictions: record.fields.dietary_restrictions,
      visa_required: record.fields.visa_required,
      accommodation_needed: record.fields.accommodation_needed,
      submitted_at: record.fields.submitted_at,
      // Parse comma-separated string back to array
      plus_one_names: record.fields.plus_one_names
        ? typeof record.fields.plus_one_names === "string"
          ? record.fields.plus_one_names
              .split(",")
              .map((name) => name.trim())
              .filter((name) => name !== "")
          : Array.isArray(record.fields.plus_one_names)
          ? record.fields.plus_one_names
          : undefined
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching RSVPs by location:", error);
    return [];
  }
}
