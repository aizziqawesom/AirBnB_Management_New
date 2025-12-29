import { NextRequest, NextResponse } from 'next/server';
import { getEmailSettings, updateEmailSettings } from '@/lib/services/email-settings';
import type { UpdateEmailSettingsData } from '@/lib/types/email-settings';

export async function GET() {
  try {
    const settings = await getEmailSettings();

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: UpdateEmailSettingsData = await request.json();

    const settings = await updateEmailSettings(body);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating email settings:', error);
    return NextResponse.json(
      { error: 'Failed to update email settings' },
      { status: 500 }
    );
  }
}
