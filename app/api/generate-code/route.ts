import { NextRequest, NextResponse } from "next/server";
import { generateUniqueCode } from "@/lib/code-generation";
import { createGuestCode } from "@/lib/airtable";

export async function POST(request: NextRequest) {
  try {
    console.log("[generate-code] POST request received");

    // Simple admin check - in production, use proper authentication
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("[generate-code] Auth header present:", !!authHeader);
    console.log("[generate-code] Admin password set:", !!adminPassword);

    if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
      console.log("[generate-code] Unauthorized - password mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { recordId } = body;

    console.log("[generate-code] RecordId received:", recordId);

    if (!recordId) {
      console.log("[generate-code] Missing recordId");
      return NextResponse.json(
        { error: "recordId is required" },
        { status: 400 }
      );
    }

    // Generate unique code
    console.log("[generate-code] Generating unique code...");
    const code = await generateUniqueCode();
    console.log("[generate-code] Generated code:", code);

    // Save code to Airtable
    console.log(
      "[generate-code] Saving code to Airtable for recordId:",
      recordId
    );
    await createGuestCode(recordId, code);
    console.log("[generate-code] Code saved successfully");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const uniqueLink = `${siteUrl}?code=${code}`;

    console.log("[generate-code] Returning success response");
    return NextResponse.json({
      code,
      uniqueLink,
    });
  } catch (error: any) {
    console.error("[generate-code] Error generating code:", error);
    console.error("[generate-code] Error message:", error.message);
    console.error("[generate-code] Error stack:", error.stack);

    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple admin check
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate code for a new guest (without recordId)
    const code = await generateUniqueCode();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const uniqueLink = `${siteUrl}?code=${code}`;

    return NextResponse.json({
      code,
      uniqueLink,
    });
  } catch (error) {
    console.error("Error generating code:", error);
    return NextResponse.json(
      { error: "Failed to generate code" },
      { status: 500 }
    );
  }
}
