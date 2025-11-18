// hooks/useEvents.ts
// Hook for fetching and managing dynamic CTF events

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface CTFEvent {
  id: string
  title: string
  date: string
  location: {
    name: string
    city: string
    country: string
    maps?: string
  }
  mode: 'In-person' | 'Virtual' | 'Hybrid'
  university: string
  description: string
  tags: string[]
  capacity?: number
  rsvpUrl?: string
  teamSize?: string
  registrationDeadline?: string
  eligibility?: string
  requirements?: string[]
  prizes?: { place: string; prize: string }[]
  sponsors?: string[]
  source: 'ctfroom' | 'ctftime' | 'manual' | 'bugbountykent'
  lastUpdated: string
  freshness?: 'fresh' | 'recent' | 'stale'
}

interface UseEventsReturn {
  events: CTFEvent[]
  loading: boolean
  error: string | null
  lastFetched: string | null
  refetch: () => Promise<void>
  eventCount: number
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CTFEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always get fresh data
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setEvents(data.events)
        setLastFetched(data.lastFetched)
      } else {
        throw new Error(data.message || 'Failed to fetch events')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events'
      setError(message)
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch events on mount
  useEffect(() => {
    fetchEvents()

    // Set up auto-refresh every hour
    const interval = setInterval(() => {
      fetchEvents()
    }, 3600000) // 1 hour

    return () => clearInterval(interval)
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    lastFetched,
    refetch: fetchEvents,
    eventCount: events.length,
  }
}

// Hook for filtering events
export function useFilteredEvents(
  events: CTFEvent[],
  searchQuery: string,
  filterMode: 'All' | 'In-person' | 'Virtual' | 'Hybrid'
) {
  return events.filter((event) => {
    // Match search query
    const matchesSearch = searchQuery === '' || 
      `${event.title} ${event.university} ${event.description} ${event.location.name} ${event.location.city} ${event.tags.join(' ')}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    // Match filter mode
    const matchesMode = filterMode === 'All' || event.mode === filterMode

    return matchesSearch && matchesMode
  })
}
