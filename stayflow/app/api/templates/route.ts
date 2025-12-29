import { NextResponse } from 'next/server';
import { getTemplates } from '@/lib/actions/messages';

export async function GET() {
  try {
    const result = await getTemplates();

    if (result.error || !result.data) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({ templates: result.data });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
