import { NextResponse } from 'next/server';
import { getTriggers } from '@/lib/services/triggers';

export async function GET() {
  try {
    const triggers = await getTriggers();

    return NextResponse.json({ triggers });
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch triggers' },
      { status: 500 }
    );
  }
}
