// app/api/events/route.ts
// API endpoint for fetching dynamic CTF events

import { NextRequest, NextResponse } from 'next/server'
import { getCTFEvents, deduplicateEvents, getEventFreshness } from '@/lib/ctf-events'

export const dynamic = 'force-dynamic' // Always fetch fresh data
export const revalidate = 3600 // Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    // Get fresh events from all sources
    const events = await getCTFEvents()

    // Deduplicate events
    const uniqueEvents = deduplicateEvents(events)

    // Add freshness status to each event
    const enrichedEvents = uniqueEvents.map((event) => ({
      ...event,
      freshness: getEventFreshness(event.lastUpdated),
    }))

    // Return with cache headers
    return NextResponse.json(
      {
        success: true,
        count: enrichedEvents.length,
        lastFetched: new Date().toISOString(),
        events: enrichedEvents,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in events API:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'public, s-maxage=60', // Cache errors for 1 minute
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
