import { NextRequest, NextResponse } from 'next/server';
import { getAllGuests } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    // Simple admin check
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const guests = await getAllGuests();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Add unique links to guests
    const guestsWithLinks = guests.map(guest => ({
      ...guest,
      unique_link: guest.invite_code ? `${siteUrl}?code=${guest.invite_code}` : null,
    }));

    return NextResponse.json({ guests: guestsWithLinks });
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}


