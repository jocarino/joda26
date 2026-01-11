import { NextRequest, NextResponse } from 'next/server';
import { createRSVP, updateRSVP, getRSVPByCodeAndLocation } from '@/lib/airtable';
import { RSVP } from '@/types/rsvp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const inviteCode = searchParams.get('invite_code');
    const location = searchParams.get('location') as RSVP['location'];

    if (!inviteCode || !location) {
      return NextResponse.json(
        { error: 'invite_code and location are required' },
        { status: 400 }
      );
    }

    const rsvp = await getRSVPByCodeAndLocation(inviteCode, location);
    
    if (rsvp) {
      return NextResponse.json({ rsvp });
    }

    return NextResponse.json({ rsvp: null });
  } catch (error: any) {
    console.error('Error fetching RSVP:', error);
    const errorMessage = error?.message || 'Failed to fetch RSVP';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'RSVP ID is required for update' },
        { status: 400 }
      );
    }

    const rsvp: RSVP = {
      id: body.id,
      invite_code: body.invite_code || undefined,
      location: body.location,
      name: body.name,
      guests: parseInt(body.guests, 10) || 1,
      attending: body.attending !== false,
      dietary_restrictions: body.dietary_restrictions || undefined,
      visa_required: body.visa_required || false,
      accommodation_needed: body.accommodation_needed || false,
      plus_one_names: body.plus_one_names && Array.isArray(body.plus_one_names) && body.plus_one_names.length > 0
        ? body.plus_one_names.filter((name: string) => name && name.trim() !== '')
        : undefined,
    };

    // Validate required fields
    if (!rsvp.location || !rsvp.name) {
      return NextResponse.json(
        { error: 'Location and name are required' },
        { status: 400 }
      );
    }

    await updateRSVP(body.id, rsvp);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating RSVP:', error);
    const errorMessage = error?.message || 'Failed to update RSVP';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if RSVP already exists for this invite_code and location
    if (body.invite_code && body.location) {
      const existingRSVP = await getRSVPByCodeAndLocation(
        body.invite_code,
        body.location
      );
      
      if (existingRSVP && existingRSVP.id) {
        // Update existing RSVP instead of creating new one
        const rsvp: RSVP = {
          id: existingRSVP.id,
          invite_code: body.invite_code || undefined,
          location: body.location,
          name: body.name,
          guests: parseInt(body.guests, 10) || 1,
          attending: body.attending !== false,
          dietary_restrictions: body.dietary_restrictions || undefined,
          visa_required: body.visa_required || false,
          accommodation_needed: body.accommodation_needed || false,
          plus_one_names: body.plus_one_names && Array.isArray(body.plus_one_names) && body.plus_one_names.length > 0
            ? body.plus_one_names.filter((name: string) => name && name.trim() !== '')
            : undefined,
        };

        // Validate required fields
        if (!rsvp.location || !rsvp.name) {
          return NextResponse.json(
            { error: 'Location and name are required' },
            { status: 400 }
          );
        }

        await updateRSVP(existingRSVP.id, rsvp);
        return NextResponse.json({ success: true, updated: true });
      }
    }
    
    // Create new RSVP
    const rsvp: RSVP = {
      invite_code: body.invite_code || undefined,
      location: body.location,
      name: body.name,
      guests: parseInt(body.guests, 10) || 1,
      attending: body.attending !== false,
      dietary_restrictions: body.dietary_restrictions || undefined,
      visa_required: body.visa_required || false,
      accommodation_needed: body.accommodation_needed || false,
      plus_one_names: body.plus_one_names && Array.isArray(body.plus_one_names) && body.plus_one_names.length > 0
        ? body.plus_one_names.filter((name: string) => name && name.trim() !== '')
        : undefined,
    };

    // Validate required fields
    if (!rsvp.location || !rsvp.name) {
      return NextResponse.json(
        { error: 'Location and name are required' },
        { status: 400 }
      );
    }

    await createRSVP(rsvp);

    return NextResponse.json({ success: true, updated: false });
  } catch (error: any) {
    console.error('Error creating RSVP:', error);
    const errorMessage = error?.message || 'Failed to create RSVP';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


