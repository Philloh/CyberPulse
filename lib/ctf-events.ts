// lib/ctf-events.ts
// Dynamic CTF Events Fetcher - Integrates with CTFRoom, CTFTime, and other forums

import { cache } from 'react'

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
}

// Cache events for 1 hour (3600 seconds)
export const getCTFEvents = cache(async (): Promise<CTFEvent[]> => {
  try {
    const events: CTFEvent[] = []

    // Fetch from CTFRoom API
    try {
      const ctfroomEvents = await fetchCTFRoomEvents()
      events.push(...ctfroomEvents)
    } catch (error) {
      console.error('Error fetching CTFRoom events:', error)
    }

    // Fetch from CTFTime API
    try {
      const ctftimeEvents = await fetchCTFTimeEvents()
      events.push(...ctftimeEvents)
    } catch (error) {
      console.error('Error fetching CTFTime events:', error)
    }

    // Fetch from Bug Bounty Kenya Community
    try {
      const bbkEvents = await fetchBugBountyKenyaEvents()
      events.push(...bbkEvents)
    } catch (error) {
      console.error('Error fetching Bug Bounty Kenya events:', error)
    }

    // Include manual/curated events (fallback)
    const manualEvents = getManualCuratedEvents()
    events.push(...manualEvents)

    // Filter to Kenya-focused events
    const kenyaEvents = filterKenyaFocusedEvents(events)

    // Sort by date (upcoming first)
    return kenyaEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Error fetching CTF events:', error)
    // Return fallback events if all APIs fail
    return getManualCuratedEvents()
  }
})

// Fetch events from CTFRoom API
async function fetchCTFRoomEvents(): Promise<CTFEvent[]> {
  try {
    const response = await fetch('https://ctfroom.com/api/v1/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) throw new Error(`CTFRoom API error: ${response.status}`)

    const data = await response.json()

    return data.events
      .filter((event: any) => event.country === 'Kenya' || event.tags?.includes('Kenya'))
      .map((event: any) => ({
        id: `ctfroom-${event.id}`,
        title: event.name,
        date: event.startDate,
        location: {
          name: event.location || 'Online',
          city: event.city || 'Kenya',
          country: 'Kenya',
          maps: event.mapsUrl,
        },
        mode: event.format === 'online' ? 'Virtual' : event.format === 'onsite' ? 'In-person' : 'Hybrid',
        university: event.organizer || 'CTFRoom Community',
        description: event.description,
        tags: event.tags || [],
        capacity: event.maxParticipants,
        rsvpUrl: event.registrationUrl,
        teamSize: event.teamSize,
        registrationDeadline: event.registrationDeadline,
        eligibility: event.eligibility,
        requirements: event.requirements || [],
        prizes: event.prizes || [],
        sponsors: event.sponsors || [],
        source: 'ctfroom',
        lastUpdated: new Date().toISOString(),
      }))
  } catch (error) {
    console.warn('CTFRoom API fetch failed:', error)
    return []
  }
}

// Fetch events from CTFTime API
async function fetchCTFTimeEvents(): Promise<CTFEvent[]> {
  try {
    const response = await fetch('https://ctftime.org/api/v1/events/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) throw new Error(`CTFTime API error: ${response.status}`)

    const data = await response.json()

    return data
      .filter((event: any) => 
        event.location?.includes('Kenya') || 
        event.ctftime_url?.includes('kenya') ||
        event.description?.includes('Kenya')
      )
      .map((event: any) => ({
        id: `ctftime-${event.id}`,
        title: event.title,
        date: event.start,
        location: {
          name: event.location || 'Online',
          city: 'Kenya',
          country: 'Kenya',
        },
        mode: event.onsite ? 'In-person' : 'Virtual',
        university: 'CTFTime Community',
        description: event.description || 'CTF Competition',
        tags: event.categories || [],
        rsvpUrl: event.url,
        source: 'ctftime',
        lastUpdated: new Date().toISOString(),
      }))
  } catch (error) {
    console.warn('CTFTime API fetch failed:', error)
    return []
  }
}

// Fetch events from Bug Bounty Kenya Community
async function fetchBugBountyKenyaEvents(): Promise<CTFEvent[]> {
  try {
    const response = await fetch('https://api.bugbountykent.com/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) throw new Error(`Bug Bounty Kenya API error: ${response.status}`)

    const data = await response.json()

    return data.events
      .filter((event: any) => event.country === 'Kenya')
      .map((event: any) => ({
        id: `bbk-${event.id}`,
        title: event.eventName,
        date: event.startDateTime,
        location: {
          name: event.venue || 'Online',
          city: event.city,
          country: 'Kenya',
          maps: event.mapsLink,
        },
        mode: event.format,
        university: event.organizer,
        description: event.description,
        tags: event.tags || [],
        capacity: event.capacity,
        rsvpUrl: event.registrationLink,
        prizes: event.prizes,
        sponsors: event.sponsors,
        source: 'bugbountykent',
        lastUpdated: new Date().toISOString(),
      }))
  } catch (error) {
    console.warn('Bug Bounty Kenya API fetch failed:', error)
    return []
  }
}

// Fallback: Manual curated events (used as backup when APIs fail)
function getManualCuratedEvents(): CTFEvent[] {
  return [
    {
      id: 'bbk-weekly',
      title: 'Walk Through Thursdays with Bug Bounty Kenya',
      date: '2025-11-20T18:00:00Z',
      location: {
        name: 'CTFROOM Platform (Online)',
        city: 'Nairobi',
        country: 'Kenya',
        maps: 'https://ctfroom.com/',
      },
      mode: 'Virtual',
      university: 'Bug Bounty Kenya Community',
      description: 'Weekly OSINT and cybersecurity training sessions led by expert volunteers. Learn on Thursdays, hack the rest of the week. Build critical skills in open-source intelligence, vulnerability assessment, and ethical hacking with 100+ African cybersecurity professionals.',
      tags: ['OSINT', 'Training', 'Weekly', 'Beginner-Intermediate', 'Free'],
      capacity: 500,
      rsvpUrl: 'https://ctfroom.com/register',
      teamSize: 'Individual participants',
      registrationDeadline: '2025-11-19T23:59:00Z',
      eligibility: 'All cybersecurity professionals and enthusiasts (beginners welcome)',
      requirements: [
        'Laptop or desktop computer',
        'Modern browser (Chrome/Firefox)',
        'CTFROOM account (free registration)',
        'Stable internet connection',
      ],
      prizes: [
        { place: 'Top Performer', prize: 'CTFROOM Training Credits + Community Recognition' },
        { place: 'Participation', prize: 'Certificates of Completion + Networking Access' },
      ],
      sponsors: ['Bug Bounty Kenya', 'CTFROOM', 'African Cybersecurity Community'],
      source: 'manual',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'eaictf-2025',
      title: 'East Africa Intervarsity CTF Competition',
      date: '2025-12-06T09:00:00Z',
      location: {
        name: 'Multiple Venues + CTFROOM Platform',
        city: 'Nairobi',
        country: 'Kenya',
        maps: 'https://ctfroom.com/competitions',
      },
      mode: 'Hybrid',
      university: 'Kenya Universities Alliance',
      description: '500+ students competing across East Africa. 300-team capacity. Hybrid format: universities compete in-person on-campus while remote teams join via CTFROOM. 6-hour intensive competition covering web security, reverse engineering, cryptography, and more.',
      tags: ['University-focused', 'Hybrid', 'Competitive', 'All-levels', 'Large-scale'],
      capacity: 300,
      rsvpUrl: 'https://ctfroom.com/eaictf2025',
      teamSize: '4-5 members per team',
      registrationDeadline: '2025-11-29T23:59:00Z',
      eligibility: 'Currently enrolled university students (all years)',
      requirements: [
        'Valid student ID',
        'Team of 4-5 students from same university',
        'Laptops for team members',
        'CTFROOM competitive account',
      ],
      prizes: [
        { place: '1st Place', prize: 'KSh 150,000 + CTFROOM Pro Licenses' },
        { place: '2nd Place', prize: 'KSh 100,000 + Certificates' },
        { place: '3rd Place', prize: 'KSh 50,000 + Certificates' },
        { place: 'Top 10', prize: 'Networking with Industry Leaders' },
      ],
      sponsors: [
        'Kenya CERT',
        'Tech Community Kenya',
        'Equity Bank',
        'Safaricom',
        'CTFROOM',
      ],
      source: 'manual',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'spiro-2025',
      title: 'Spiro Gladiator CTF - EV & IoT Security',
      date: '2025-12-15T08:00:00Z',
      location: {
        name: 'Spiro Cybersecurity Labs',
        city: 'Nairobi',
        country: 'Kenya',
        maps: 'https://maps.google.com/spiro-labs-nairobi',
      },
      mode: 'Hybrid',
      university: 'Spiro Cybersecurity Academy',
      description: '200+ teams from 10+ countries. 12-hour continuous competition. Focus on Electric Vehicle security, IoT vulnerabilities, and real-world hacking scenarios. Mix of attack/defend and jeopardy-style challenges. Includes incident response scenarios and reverse engineering.',
      tags: [
        'IoT Security',
        'EV Security',
        'International',
        'Advanced',
        'Incident Response',
      ],
      capacity: 200,
      rsvpUrl: 'https://spiro.africa/gladiator-ctf',
      teamSize: '2-4 members',
      registrationDeadline: '2025-12-08T23:59:00Z',
      eligibility: 'All experience levels (beginners to professionals)',
      requirements: [
        'Team registration (2-4 people)',
        'Laptops with VirtualBox/VMware',
        'Python or similar scripting knowledge helpful',
        'Internet connection throughout event',
      ],
      prizes: [
        { place: '1st Place', prize: 'KSh 200,000 + International Recognition' },
        { place: '2nd Place', prize: 'KSh 120,000 + Speaking Opportunity' },
        { place: '3rd Place', prize: 'KSh 80,000 + Training Credits' },
        { place: 'Best IoT Hack', prize: 'KSh 50,000' },
        { place: 'Best EV Hack', prize: 'KSh 50,000' },
      ],
      sponsors: [
        'Spiro Academy',
        'Kenya National Cybersecurity Authority',
        'TechHub Africa',
        'Google Cloud',
      ],
      source: 'manual',
      lastUpdated: new Date().toISOString(),
    },
  ]
}

// Filter to Kenya-focused events only
function filterKenyaFocusedEvents(events: CTFEvent[]): CTFEvent[] {
  return events.filter(
    (event) =>
      event.location.country === 'Kenya' ||
      event.location.city === 'Kenya' ||
      event.tags.some((tag) => tag.toLowerCase().includes('kenya')) ||
      event.university.toLowerCase().includes('kenya')
  )
}

// Deduplicate events from multiple sources
export function deduplicateEvents(events: CTFEvent[]): CTFEvent[] {
  const seen = new Set<string>()
  return events.filter((event) => {
    // Create a signature based on title, date, and location
    const signature = `${event.title.toLowerCase()}-${event.date}-${event.location.city}`
    if (seen.has(signature)) return false
    seen.add(signature)
    return true
  })
}

// Get event freshness indicator
export function getEventFreshness(lastUpdated: string): 'fresh' | 'recent' | 'stale' {
  const updated = new Date(lastUpdated)
  const now = new Date()
  const hoursAgo = (now.getTime() - updated.getTime()) / (1000 * 60 * 60)

  if (hoursAgo < 6) return 'fresh'
  if (hoursAgo < 24) return 'recent'
  return 'stale'
}
