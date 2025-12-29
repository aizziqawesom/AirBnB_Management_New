import { NextResponse } from 'next/server';
import { getInboxStats } from '@/lib/services/inbox';

export async function GET() {
  try {
    const stats = await getInboxStats();

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching inbox stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inbox stats' },
      { status: 500 }
    );
  }
}
