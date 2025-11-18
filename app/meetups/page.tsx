'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, Download, Filter, Search, Ticket, PartyPopper, ExternalLink, Trophy, GraduationCap, Shield, RefreshCw, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import CalendarModal from '../components/CalendarModal'
import { useEvents, useFilteredEvents } from '@/hooks/useEvents'

type CTFEvent = {
  id: string
  title: string
  date: string
  location: { name: string; city: string; country: string; maps?: string }
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
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function makeICS(meetup: CTFEvent) {
  const start = new Date(meetup.date)
  const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CyberPulse KE//Meetups//EN',
    'BEGIN:VEVENT',
    `UID:${meetup.id}@cyberpulse-ke`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${meetup.title}`,
    `LOCATION:${meetup.location.name}, ${meetup.location.city}, ${meetup.location.country}`,
    `DESCRIPTION:${meetup.description}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  return new Blob([lines], { type: 'text/calendar;charset=utf-8' })
}

export default function MeetupsPage() {
  const [search, setSearch] = useState('')
  const [mode, setMode] = useState<'All' | 'In-person' | 'Virtual' | 'Hybrid'>('All')
  const [selectedMeetup, setSelectedMeetup] = useState<CTFEvent | null>(null)
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false)
  
  const { events, loading, error, lastFetched, refetch, eventCount } = useEvents()
  
  const filtered = useMemo(() => {
    if (!events) return []
    return events.filter(m => {
      const text = `${m.title} ${m.university} ${m.description} ${m.location.name} ${m.location.city} ${m.location.country} ${m.tags.join(' ')}`.toLowerCase()
      const matchText = text.includes(search.toLowerCase())
      const matchMode = mode === 'All' || m.mode === mode
      return matchText && matchMode
    })
  }, [events, search, mode])

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20">
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 pb-2 leading-tight md:leading-[1.15] bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">CTF Events</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">University-focused CTF meetups and competitions across Kenya. Build a team, learn, and compete.</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 mb-6 sm:mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="cyber-card p-4 sm:p-6">
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                Search Events
              </label>
              <input 
                className="input-cyber w-full text-sm" 
                placeholder="Search by event name, city, topic, or keyword..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                Filter by Format
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                {['All', 'In-person', 'Virtual', 'Hybrid'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setMode(option as any)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all font-medium text-xs sm:text-sm ${
                      mode === option
                        ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                        : 'border-cyber-green/30 text-gray-400 hover:border-cyber-green/60 hover:text-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading and Error States */}
            <div className="mt-4 pt-4 border-t border-cyber-green/20">
              {error && (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 sm:p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm sm:text-base font-semibold">Error loading events</p>
                    <p className="text-red-300/80 text-xs sm:text-sm mt-1">{error}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 px-3 py-1 bg-red-700/40 hover:bg-red-700/60 rounded text-red-300 text-xs sm:text-sm transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              
              {loading && (
                <div className="bg-cyber-green/10 border border-cyber-green/30 rounded-lg p-3 sm:p-4 mb-4">
                  <p className="text-cyber-green text-xs sm:text-sm">Loading CTF events from our community forums...</p>
                </div>
              )}
              
              {!error && !loading && lastFetched && (
                <div className="text-xs sm:text-sm text-gray-400 mb-4 flex items-center justify-between">
                  <span>
                    Last updated: {new Date(lastFetched).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-1 text-cyber-green hover:text-cyber-green/80 transition-colors"
                  >
                    <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              )}
              
              {!loading && filtered.length > 0 && (
                <p className="text-xs sm:text-sm text-gray-400">
                  Found <span className="text-cyber-green font-semibold">{filtered.length}</span> event{filtered.length !== 1 ? 's' : ''} ({eventCount} total)
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {filtered.map((m, idx) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }} className="cyber-card p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{m.title}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-1">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span className="truncate">{m.university}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-gray-400 text-xs sm:text-sm">
                    <span className="flex items-center"><Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> {formatDateTime(m.date)}</span>
                    <span className="flex items-center"><Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" /> 2h</span>
                  </div>
                </div>
                <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold border border-cyber-green/30 text-cyber-green whitespace-nowrap">{m.mode}</span>
              </div>

              <div className="mt-3 sm:mt-4 text-gray-300 text-sm line-clamp-3">{m.description}</div>

              <div className="mt-3 sm:mt-4 flex items-center text-gray-400 text-xs sm:text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                {m.location.maps ? (
                  <a href={m.location.maps} target="_blank" rel="noreferrer" className="underline hover:no-underline break-words">
                    {m.location.name}, {m.location.city}, {m.location.country}
                  </a>
                ) : (
                  <span>{m.location.name}, {m.location.city}, {m.location.country}</span>
                )}
              </div>

              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="text-gray-400"><Shield className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Eligibility: <span className="text-gray-300 block sm:inline">{m.eligibility || 'Students'}</span></div>
                <div className="text-gray-400"><Users className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Team: <span className="text-gray-300 block sm:inline">{m.teamSize || '1–4'}</span></div>
                <div className="text-gray-400"><Calendar className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Deadline: <span className="text-gray-300 block sm:inline">{m.registrationDeadline ? formatDateTime(m.registrationDeadline) : '—'}</span></div>
                <div className="text-gray-400">Capacity: <span className="text-gray-300 block sm:inline">{m.capacity || '—'}</span></div>
              </div>

              {m.requirements && m.requirements.length > 0 && (
                <div className="mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Requirements</div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300 text-xs sm:text-sm">
                    {m.requirements.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              )}

              {m.prizes && m.prizes.length > 0 && (
                <div className="mt-3 sm:mt-4">
                  <div className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 flex items-center gap-2"><Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-cyber-yellow" /> Prizes</div>
                  <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
                    {m.prizes.map((p) => <li key={p.place}><span className="font-semibold">{p.place}:</span> {p.prize}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
                {m.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded border border-cyber-green/20 text-xs text-gray-400">#{tag}</span>
                ))}
              </div>

              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                {m.rsvpUrl && (
                  <Link href={m.rsvpUrl} target="_blank" className="px-2 sm:px-3 py-1.5 sm:py-2 border border-cyber-green/40 rounded-lg text-cyber-green hover:bg-cyber-green/10 transition-colors flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-sm">
                    <Ticket className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>RSVP</span> <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    setSelectedMeetup(m)
                    setIsCalendarModalOpen(true)
                  }}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 border border-cyber-green/40 rounded-lg text-cyber-green hover:bg-cyber-green/10 transition-colors flex items-center gap-1 sm:gap-2 justify-center sm:justify-start text-xs sm:text-sm flex-1 sm:flex-initial"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" /> <span>Add to Calendar</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400 text-sm sm:text-base">
            No upcoming events. Check back soon!
          </div>
        )}
      </section>

      <section className="container mx-auto px-3 sm:px-4 mt-8 sm:mt-12">
        <div className="cyber-card p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Host or Sponsor an Event</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">Want to host a CTF competition, training session, or workshop in Kenya? Partner with CTFROOM, Bug Bounty Kenya, or contact us to organize your event.</p>
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div><Link href="mailto:events@ctfroom.com?subject=Host%20a%20CTF%20Event%20in%20Kenya" className="text-cyber-green underline hover:no-underline break-all">Contact CTFROOM: events@ctfroom.com</Link></div>
            <div><Link href="https://bugbountykeny.com/" className="text-cyber-green underline hover:no-underline" target="_blank">Visit Bug Bounty Kenya Community</Link></div>
            <div><Link href="mailto:events@cyberpulse.ke?subject=Host%20a%20Security%20Event" className="text-cyber-green underline hover:no-underline break-all">Email CyberPulse KE: events@cyberpulse.ke</Link></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-12">
        <div className="cyber-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="h-5 w-5 text-cyber-yellow" /> Champions & Top Teams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[ 
              { year: 2024, event: 'East Africa Intervarsity CTF Finals', team: 'BinaryBeasts', university: 'Jomo Kenyatta University of Agriculture and Technology', members: 4, placement: '1st' },
              { year: 2024, event: 'East Africa Intervarsity CTF', team: 'Packet Ninjas', university: 'University of Nairobi', members: 3, placement: '2nd' },
              { year: 2024, event: 'Spiro Gladiator CTF', team: 'QuantumShell', university: 'Kenyatta University', members: 4, placement: '3rd' },
              { year: 2025, event: 'Walk Through Thursdays - Top Performer', team: 'Security Sentinels', university: 'Strathmore University', members: 2, placement: 'Featured' },
              { year: 2025, event: 'East Africa Intervarsity Qualifiers', team: 'NullPointers', university: 'University of Nairobi', members: 4, placement: '1st Qualifiers' },
              { year: 2025, event: 'Bug Bounty Kenya - OSINT Master', team: 'InfoHunters', university: 'Nairobi Tech Community', members: 3, placement: 'Top Performer' },
            ].map((w) => (
              <div key={`${w.year}-${w.team}`} className="border border-cyber-green/20 rounded-lg p-4">
                <div className="font-semibold text-cyber-green">{w.placement}</div>
                <div className="font-semibold text-lg">{w.team}</div>
                <div className="text-gray-400 text-sm">{w.university}</div>
                <div className="text-gray-400 text-sm">{w.event} • {w.year} • {w.members} members</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedMeetup && (
        <CalendarModal 
          isOpen={isCalendarModalOpen}
          onClose={() => {
            setIsCalendarModalOpen(false)
            setSelectedMeetup(null)
          }}
          meetup={selectedMeetup}
        />
      )}
    </div>
  )
}


