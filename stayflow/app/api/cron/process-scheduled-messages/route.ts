import { NextRequest, NextResponse } from 'next/server';
import { processScheduledMessages } from '@/lib/services/scheduled-message-processor';

/**
 * Cron job endpoint for processing scheduled messages
 * This runs hourly via Vercel Cron
 *
 * Security: Protected by CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.error('[CRON] CRON_SECRET is not configured');
      return NextResponse.json(
        { error: 'Cron job is not configured' },
        { status: 500 }
      );
    }

    // Check authorization header
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.error('[CRON] Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process scheduled messages
    console.log('[CRON] Starting scheduled message processing...');
    const result = await processScheduledMessages();

    console.log('[CRON] Scheduled message processing complete:', result);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: result,
    });
  } catch (error) {
    console.error('[CRON] Error in scheduled message processing:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
