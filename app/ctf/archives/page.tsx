'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Archive, Calendar, Trophy, Users, Filter, Search, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function CTFArchivesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')

  // Past CTF events with archives
  const archiveEvents = [
    {
      id: '1',
      title: 'East Africa Intervarsity CTF 2024 Finals',
      year: 2024,
      date: 'December 10, 2024',
      difficulty: 'Hard',
      participants: 200,
      category: 'Competition',
      description: 'Final round of the annual East Africa Intervarsity CTF competition. Challenges covered web exploitation, cryptography, and reverse engineering.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '2',
      title: 'Walk Through Thursdays - OSINT Training Series 2024',
      year: 2024,
      date: 'November 14, 2024',
      difficulty: 'Medium',
      participants: 150,
      category: 'Training',
      description: 'Weekly OSINT training sessions by Bug Bounty Kenya. Topics included information gathering, social engineering defense, and digital footprint analysis.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '3',
      title: 'Spiro Gladiator CTF 2024 - EV & IoT Security',
      year: 2024,
      date: 'October 22, 2024',
      difficulty: 'Expert',
      participants: 180,
      category: 'Competition',
      description: '12-hour specialized CTF focusing on Electric Vehicle and IoT security. 13+ challenges across AI, Web3, and Reverse Engineering.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '4',
      title: 'Kenya Cyber Summit 2024',
      year: 2024,
      date: 'September 15, 2024',
      difficulty: 'Medium',
      participants: 300,
      category: 'Conference',
      description: 'Annual cybersecurity conference featuring keynotes, workshops, and mini-CTF challenges. Focus on securing African infrastructure.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '5',
      title: 'East Africa Intervarsity CTF 2024 Qualifiers',
      year: 2024,
      date: 'August 20, 2024',
      difficulty: 'Medium',
      participants: 400,
      category: 'Competition',
      description: 'Qualification round for university teams. Challenges designed to test foundational cybersecurity knowledge and problem-solving skills.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '6',
      title: 'Nairobi Hack Night 2024',
      year: 2024,
      date: 'July 25, 2024',
      difficulty: 'Easy',
      participants: 120,
      category: 'Meetup',
      description: 'Community-organized CTF meetup in Nairobi. Beginner-friendly challenges focused on web security and basic cryptography.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '7',
      title: 'Intro to Cryptography - Bug Bounty Kenya Workshop',
      year: 2024,
      date: 'June 10, 2024',
      difficulty: 'Easy',
      participants: 95,
      category: 'Workshop',
      description: 'Introduction to cryptographic concepts and common cipher implementations. Perfect for beginners starting their CTF journey.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '8',
      title: 'API Security Masterclass 2024',
      year: 2024,
      date: 'May 8, 2024',
      difficulty: 'Medium',
      participants: 110,
      category: 'Training',
      description: 'In-depth workshop on REST API security vulnerabilities, testing methodologies, and real-world exploitation techniques.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '9',
      title: 'East Africa Intervarsity CTF 2023 Finals',
      year: 2023,
      date: 'December 2, 2023',
      difficulty: 'Hard',
      participants: 180,
      category: 'Competition',
      description: 'Previous year final competition. Archived challenges and writeups available for learning and practice.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
    {
      id: '10',
      title: 'TryHackMe East Africa Chapter Event',
      year: 2023,
      date: 'October 15, 2023',
      difficulty: 'Easy',
      participants: 200,
      category: 'Meetup',
      description: 'Collaborative training event with TryHackMe platform. Covered beginner to intermediate level challenges.',
      writeupUrl: '#',
      archiveUrl: '#'
    },
  ]

  // Get unique years from archive
  const years = ['All', ...Array.from(new Set(archiveEvents.map(e => e.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))]
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Expert']

  // Filter events
  const filteredEvents = useMemo(() => {
    return archiveEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesYear = selectedYear === 'All' || event.year.toString() === selectedYear
      const matchesDifficulty = selectedDifficulty === 'All' || event.difficulty === selectedDifficulty
      return matchesSearch && matchesYear && matchesDifficulty
    })
  }, [searchQuery, selectedYear, selectedDifficulty])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-cyber-green'
      case 'Medium': return 'text-cyber-yellow'
      case 'Hard': return 'text-orange-500'
      case 'Expert': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Competition': return '🏆'
      case 'Training': return '📚'
      case 'Workshop': return '🛠️'
      case 'Meetup': return '👥'
      case 'Conference': return '🎤'
      default: return '📋'
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 sm:pb-20">
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Archive className="h-10 w-10 sm:h-12 sm:w-12 text-cyber-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
            CTF Archives
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-2">
            Explore past CTF competitions, training sessions, and community events
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Access writeups, challenge files, and learn from previous competitions
          </p>
        </motion.div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-3 sm:px-4 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="cyber-card p-4 sm:p-6">
            {/* Search */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                Search Events
              </label>
              <input
                type="text"
                placeholder="Search by title, category, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-cyber w-full text-sm"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Year Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                  Year
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
                        selectedYear === year
                          ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                          : 'border-cyber-green/30 text-gray-400 hover:border-cyber-green/60'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 sm:mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                  Difficulty
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all text-xs sm:text-sm font-medium ${
                        selectedDifficulty === difficulty
                          ? 'border-cyber-green bg-cyber-green/20 text-cyber-green'
                          : 'border-cyber-green/30 text-gray-400 hover:border-cyber-green/60'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-4 pt-4 border-t border-cyber-green/20">
              <p className="text-xs sm:text-sm text-gray-400">
                Found <span className="text-cyber-green font-semibold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Archive Events Grid */}
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {filteredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="cyber-card p-4 sm:p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl sm:text-2xl">{getCategoryIcon(event.category)}</span>
                    <span className="text-xs sm:text-sm font-semibold text-cyber-green/70 px-2 py-1 bg-cyber-green/10 rounded">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 line-clamp-2">
                    {event.title}
                  </h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs sm:text-sm font-bold ${getDifficultyColor(event.difficulty)}`}>
                    {event.difficulty}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-cyber-green/50" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 flex-shrink-0 text-cyber-green/50" />
                  <span>{event.participants} participants</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 flex-grow line-clamp-3">
                {event.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-cyber-green/20">
                <Link
                  href={event.writeupUrl}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-cyber-green/10 border border-cyber-green/40 rounded-lg text-cyber-green hover:bg-cyber-green/20 transition-colors text-xs sm:text-sm font-medium text-center"
                >
                  <BookOpen className="inline h-4 w-4 mr-1" />
                  Writeup
                </Link>
                <Link
                  href={event.archiveUrl}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10 rounded-lg transition-colors text-xs sm:text-sm font-medium text-center"
                >
                  <Archive className="inline h-4 w-4 mr-1" />
                  Files
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-400 text-sm sm:text-base">
            <Archive className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-50" />
            <p>No events found matching your filters.</p>
            <p className="text-xs sm:text-sm mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-3 sm:px-4">
        <div className="cyber-card p-4 sm:p-6 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-cyber-green mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            About These Archives
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
            Our CTF archives contain historical records of cybersecurity competitions, training sessions, and community events held across Kenya and East Africa. These resources are invaluable for anyone looking to understand the evolution of the local CTF scene and for learners seeking quality challenges from past competitions.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Each archived event includes challenge writeups, solution files, and detailed walkthroughs. Use these resources to practice, learn new techniques, and prepare for upcoming competitions.
          </p>
        </div>
      </section>
    </div>
  )
}
