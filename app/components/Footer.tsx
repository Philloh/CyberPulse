import Link from 'next/link'
import { Shield, Handshake } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-cyber-darker border-t border-cyber-green/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-cyber-green" />
              <span className="text-xl font-bold text-cyber-green">CyberPulse KE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Kenya’s neon-lit hub for CTF challenges, cybersecurity news, and hands-on tech intel crafted for the community.
            </p>
          </div>

          <div className="rounded-lg border border-cyber-green/30 bg-cyber-darker/60 p-5 shadow-lg shadow-cyber-green/10">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-cyber-green/10 p-2">
                <Handshake className="h-5 w-5 text-cyber-green" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyber-green mb-2">CyberPulse KE Partnerships</h3>
                <p className="text-sm text-gray-300">
                  Co-create campus leagues, co-brand research drops, or bring cyber safaris to your next tech festival. We’ll tailor the collab.
                </p>
                <Link
                  href="/partners"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-cyber-green/70 bg-gradient-to-r from-cyber-green to-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-green"
                >
                  Email Partnerships Team
                </Link>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-cyber-green mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-cyber-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/adventures" className="text-gray-400 hover:text-cyber-green transition-colors">
                  Security Adventures
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-cyber-green transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/meetups" className="text-gray-400 hover:text-cyber-green transition-colors">
                  Meetups
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyber-green transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cyber-green/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} CyberPulse KE. All rights reserved.</p>
          <p className="mt-2">Built with love for the Kenyan cybersecurity community</p>
        </div>
      </div>
    </footer>
  )
}

