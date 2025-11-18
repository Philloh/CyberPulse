'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Copy, Check, ExternalLink } from 'lucide-react'

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  meetup: {
    id: string
    title: string
    date: string
    location: { name: string; city: string; country: string }
    description: string
  }
}

export default function CalendarModal({ isOpen, onClose, meetup }: CalendarModalProps) {
  const [copied, setCopied] = useState(false)

  const eventDate = new Date(meetup.date)
  const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)

  // Format for Google Calendar URL
  const formatDateForGoogle = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetup.title)}&dates=${formatDateForGoogle(eventDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(meetup.description)}&location=${encodeURIComponent(meetup.location.name + ', ' + meetup.location.city)}`

  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(meetup.title)}&startdt=${eventDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(meetup.description)}&location=${encodeURIComponent(meetup.location.name + ', ' + meetup.location.city)}`

  // Generate ICS content
  const generateICS = () => {
    const dt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CyberPulse KE//Meetups//EN',
      'BEGIN:VEVENT',
      `UID:${meetup.id}@cyberpulse-ke`,
      `DTSTAMP:${dt(new Date())}`,
      `DTSTART:${dt(eventDate)}`,
      `DTEND:${dt(endDate)}`,
      `SUMMARY:${meetup.title}`,
      `LOCATION:${meetup.location.name}, ${meetup.location.city}, ${meetup.location.country}`,
      `DESCRIPTION:${meetup.description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
  }

  const handleDownloadICS = () => {
    const icsContent = generateICS()
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${meetup.title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleCopyDetails = () => {
    const text = `📅 Event: ${meetup.title}
📍 Location: ${meetup.location.name}, ${meetup.location.city}, ${meetup.location.country}
🕐 Date & Time: ${eventDate.toLocaleString()}
📝 Description: ${meetup.description}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyber-green/30 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyber-green/20 to-cyber-blue/20 border-b border-cyber-green/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-cyber-green" />
                  <h2 className="text-lg font-bold text-gray-100">Add to Calendar</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Event Preview */}
                <div className="bg-gray-800/50 border border-cyber-green/20 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-100 mb-2 text-sm">{meetup.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2">{meetup.description}</p>
                </div>

                {/* Calendar Options */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Popular Calendar Services</p>

                  {/* Google Calendar */}
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyber-green/50 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-bold text-xs">G</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 group-hover:text-cyber-green transition-colors">Google Calendar</p>
                      <p className="text-xs text-gray-500">Opens in new tab</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyber-green transition-colors flex-shrink-0" />
                  </a>

                  {/* Outlook Calendar */}
                  <a
                    href={outlookCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyber-green/50 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-400 font-bold text-xs">O</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 group-hover:text-cyber-green transition-colors">Outlook Calendar</p>
                      <p className="text-xs text-gray-500">Opens in new tab</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-cyber-green transition-colors flex-shrink-0" />
                  </a>

                  {/* iCal Download */}
                  <button
                    onClick={handleDownloadICS}
                    className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyber-green/50 rounded-lg transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold text-xs">📥</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 group-hover:text-cyber-green transition-colors">Download iCal File</p>
                      <p className="text-xs text-gray-500">For Apple Calendar & others</p>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700/50 pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Other Options</p>

                  {/* Copy to Clipboard */}
                  <button
                    onClick={handleCopyDetails}
                    className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyber-green/50 rounded-lg transition-all group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 group-hover:text-cyber-green transition-colors">
                        {copied ? 'Copied!' : 'Copy Event Details'}
                      </p>
                      <p className="text-xs text-gray-500">Paste anywhere you need</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-800/30 border-t border-gray-700/50 px-6 py-3">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-cyber-green/10 hover:bg-cyber-green/20 border border-cyber-green/30 rounded-lg text-cyber-green font-medium text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
