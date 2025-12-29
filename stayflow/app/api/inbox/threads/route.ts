import { NextRequest, NextResponse } from 'next/server';
import { getInboxThreads } from '@/lib/services/inbox';
import type { InboxFilters } from '@/lib/types/inbox';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters: InboxFilters = body.filters || {};

    const threads = await getInboxThreads(filters);

    return NextResponse.json({ threads });
  } catch (error) {
    console.error('Error fetching inbox threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inbox threads' },
      { status: 500 }
    );
  }
}
