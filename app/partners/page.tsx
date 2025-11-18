'use client'

import { useMemo, useState } from 'react'
import { Handshake, Send } from 'lucide-react'
import Link from 'next/link'

export default function PartnersPage() {
  const [name, setName] = useState('')
  const [organization, setOrganization] = useState('')
  const [email, setEmail] = useState('')
  const [initiative, setInitiative] = useState('')
  const [message, setMessage] = useState('')
  const [justTriggered, setJustTriggered] = useState(false)

  const mailtoLink = useMemo(() => {
    const subject = encodeURIComponent(`Partnership inquiry from ${name || 'CyberPulse friend'}`)
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Organization: ${organization}`,
        `Email: ${email}`,
        `Initiative: ${initiative}`,
        '',
        message,
      ].join('\n'),
    )

    return `mailto:partners@cyberpulse.ke?subject=${subject}&body=${body}`
  }, [email, initiative, message, name, organization])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.open(mailtoLink, '_blank', 'noopener,noreferrer')
    setJustTriggered(true)
    setTimeout(() => setJustTriggered(false), 4000)
  }

  return (
    <div className="pt-20 pb-20">
      <section className="container mx-auto px-4 max-w-3xl space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2">
            <Handshake className="h-8 w-8 text-cyber-green" />
            <h1 className="text-4xl md:text-5xl font-bold">Partner With CyberPulse</h1>
          </div>
          <p className="text-gray-400">
            Collaborate on meetups, CTF leagues, awareness campaigns, or exclusive research drops. Craft your message
            below and we’ll reply with a tailored partnership plan.
          </p>
        </header>

        <div className="cyber-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Organization / Team</label>
                <input
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  required
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Desired Initiative</label>
                <input
                  value={initiative}
                  onChange={(event) => setInitiative(event.target.value)}
                  placeholder="e.g. Campus CTF Circuit"
                  required
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Partnership Goals & Message</label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                required
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-green/20 rounded-lg text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="cyber-button flex items-center justify-center gap-2 text-base font-semibold"
            >
              Send Partnership Email
              <Send className="h-5 w-5" />
            </button>
            {justTriggered && (
              <p className="text-sm text-cyber-green text-center">
                Opening your email client—hit send to deliver the message.
              </p>
            )}
          </form>
        </div>

        <div className="text-center text-sm text-gray-400 space-y-2">
          <p>Prefer a direct line? Email us anytime at partners@cyberpulse.ke</p>
          <p>
            Looking for general inquiries instead?{' '}
            <Link href="/contact" className="text-cyber-green hover:underline">
              Visit the contact hub
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}

