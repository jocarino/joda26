import { NextRequest, NextResponse } from 'next/server';
import { getAllRSVPs } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    // Simple admin check
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (adminPassword && authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rsvps = await getAllRSVPs();

    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}


