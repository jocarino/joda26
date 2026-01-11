import { NextRequest, NextResponse } from 'next/server';
import { validateCode } from '@/lib/code-validation';

export async function POST(request: NextRequest) {
  try {
    console.log("[validate-code] Request received");
    const body = await request.json();
    const { code } = body;

    console.log("[validate-code] Code received:", code, "Type:", typeof code);

    if (!code || typeof code !== 'string') {
      console.log("[validate-code] Invalid code format - missing or wrong type");
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    console.log("[validate-code] Client IP:", ip);

    const normalizedCode = code.toUpperCase().trim();
    console.log("[validate-code] Normalized code:", normalizedCode);

    const guest = await validateCode(normalizedCode, ip);

    if (!guest) {
      console.log(`[validate-code] Validation failed for code: ${normalizedCode}`);
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
    }

    console.log(`[validate-code] Validation successful for code: ${normalizedCode}, guest: ${guest.name}`);
    return NextResponse.json({ guest });
  } catch (error: any) {
    console.error('[validate-code] Error caught:', error);
    console.error('[validate-code] Error message:', error.message);
    console.error('[validate-code] Error stack:', error.stack);
    
    if (error.message && error.message.includes('Too many validation attempts')) {
      console.log('[validate-code] Rate limit exceeded');
      return NextResponse.json(
        { error: error.message },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to validate code' },
      { status: 500 }
    );
  }
}


