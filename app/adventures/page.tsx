'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Zap, Shield, Target, TrendingUp, Award } from 'lucide-react'
import AdventureCard from '../components/AdventureCard'
import adventuresData from '../../data/adventures.json'

interface HighScore {
  adventureId: string
  adventureTitle: string
  score: number
  date: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

// Types for adventure summary used in listing
interface AdventureSummary {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

// Use single source of truth for adventures
const adventures: AdventureSummary[] = adventuresData.adventures as AdventureSummary[]
const easyAdventureIds = adventures.filter((adventure) => adventure.difficulty === 'Easy').map((adventure) => adventure.id)
const mediumAdventureIds = adventures.filter((adventure) => adventure.difficulty === 'Medium').map((adventure) => adventure.id)
const hardAdventureIds = adventures.filter((adventure) => adventure.difficulty === 'Hard').map((adventure) => adventure.id)

const defaultAchievements: Achievement[] = [
  {
    id: 'first-adventure',
    title: 'Explorer',
    description: 'Complete your first Security Adventure',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'perfect-score',
    title: 'Cipher Master',
    description: 'Earn a perfect score (100 points) on any adventure',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'all-easy',
    title: 'Security Novice',
    description: 'Complete all Easy difficulty adventures',
    icon: '🟢',
    unlocked: false,
  },
  {
    id: 'all-medium',
    title: 'Security Expert',
    description: 'Complete all Medium difficulty adventures',
    icon: '🟡',
    unlocked: false,
  },
  {
    id: 'all-hard',
    title: 'Breach Avoided',
    description: 'Complete all Hard difficulty adventures',
    icon: '🔴',
    unlocked: false,
  },
  {
    id: 'all-adventures',
    title: 'Guardian',
    description: 'Complete all Security Adventures',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'high-roller',
    title: 'Elite Defender',
    description: 'Earn 500+ total points across all adventures',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'half-complete',
    title: 'Halfway There',
    description: 'Complete 5 Security Adventures',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'all-expert',
    title: 'Security Grandmaster',
    description: `Complete all ${adventures.length} Security Adventures`,
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'perfect-master',
    title: 'Flawless Guardian',
    description: 'Get perfect 100-point scores on 5+ adventures',
    icon: '✨',
    unlocked: false,
  },
]

export default function AdventuresPage() {
  const [highScores, setHighScores] = useState<HighScore[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [totalPoints, setTotalPoints] = useState(0)
  const [completedAdventures, setCompletedAdventures] = useState(new Set<string>())

  // Load data from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('adventureHighScores')
    const savedAchievements = localStorage.getItem('adventureAchievements')
    const savedTotal = localStorage.getItem('adventureTotalPoints')
    const savedCompleted = localStorage.getItem('adventureCompleted')

    if (savedScores) {
      setHighScores(JSON.parse(savedScores))
    }
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements))
    }
    if (savedTotal) {
      setTotalPoints(parseInt(savedTotal))
    }
    if (savedCompleted) {
      setCompletedAdventures(new Set(JSON.parse(savedCompleted)))
    }
  }, [])

  // Calculate and update achievements
  useEffect(() => {
    const newAchievements = [...achievements]
    const unlockedIds = new Set<string>()

    // First Adventure
    if (completedAdventures.size > 0) {
      newAchievements[0].unlocked = true
      unlockedIds.add('first-adventure')
    }

    // Perfect Score
    if (highScores.some(score => score.score === 100)) {
      newAchievements[1].unlocked = true
      unlockedIds.add('perfect-score')
    }

    // All Easy
    if (easyAdventureIds.length > 0 && easyAdventureIds.every((id: string) => completedAdventures.has(id))) {
      newAchievements[2].unlocked = true
      unlockedIds.add('all-easy')
    }

    // All Medium
    if (mediumAdventureIds.length > 0 && mediumAdventureIds.every((id: string) => completedAdventures.has(id))) {
      newAchievements[3].unlocked = true
      unlockedIds.add('all-medium')
    }

    // All Hard
    if (hardAdventureIds.length > 0 && hardAdventureIds.every((id: string) => completedAdventures.has(id))) {
      newAchievements[4].unlocked = true
      unlockedIds.add('all-hard')
    }

    // All Adventures
    if (adventures.every((a: AdventureSummary) => completedAdventures.has(a.id))) {
      newAchievements[5].unlocked = true
      unlockedIds.add('all-adventures')
    }

    // High Roller (500+ points)
    if (totalPoints >= 500) {
      newAchievements[6].unlocked = true
      unlockedIds.add('high-roller')
    }

    // Halfway There (5+ adventures completed)
    if (completedAdventures.size >= 5) {
      newAchievements[7].unlocked = true
      unlockedIds.add('half-complete')
    }

    // Security Grandmaster (All adventures)
    if (completedAdventures.size === adventures.length) {
      newAchievements[8].unlocked = true
      unlockedIds.add('all-expert')
    }

    // Flawless Guardian (5+ perfect scores)
    const perfectScores = highScores.filter(score => score.score === 100).length
    if (perfectScores >= 5) {
      newAchievements[9].unlocked = true
      unlockedIds.add('perfect-master')
    }

    setAchievements(newAchievements)
    localStorage.setItem('adventureAchievements', JSON.stringify(newAchievements))
  }, [completedAdventures, highScores, totalPoints, achievements])

  const topScores = highScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="pt-16 sm:pt-20 pb-16 sm:pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-4 sm:mb-6">
            <Shield className="h-12 sm:h-16 w-12 sm:w-16 text-cyber-green mx-auto mb-2 sm:mb-4" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 pb-2 leading-tight md:leading-[1.15] bg-gradient-to-r from-cyber-green to-cyber-blue bg-clip-text text-transparent">
            Security Adventures
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 px-2">
            Navigate real-world cybersecurity dilemmas through interactive stories. Make smart choices, earn survival points, and unlock achievements.
          </p>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[
            { icon: Trophy, label: 'Total Points', value: totalPoints, color: 'text-cyber-green' },
            { icon: Target, label: 'Completed', value: completedAdventures.size, color: 'text-cyber-blue', suffix: '/' + adventures.length },
            { icon: Award, label: 'Achievements', value: unlockedCount, color: 'text-yellow-400', suffix: '/' + defaultAchievements.length },
            { icon: Zap, label: 'Rank', value: completedAdventures.size === 0 ? 'Novice' : totalPoints >= 500 ? 'Master' : 'Advanced', color: 'text-cyber-purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="cyber-card text-center p-3 sm:p-4 md:p-6"
            >
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === 'number' ? stat.value : stat.value}
                {stat.suffix && <span className="text-gray-400 text-xs sm:text-sm block">{stat.suffix}</span>}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Scores Section */}
      {highScores.length > 0 && (
        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cyber-card p-4 sm:p-6"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-cyber-green mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold text-cyber-green">Leaderboard</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {topScores.map((score, index) => (
                <div
                  key={`${score.adventureId}-${score.date}`}
                  className="flex items-center justify-between p-3 sm:p-4 bg-cyber-darkGray rounded-lg border border-cyber-green/20 hover:border-cyber-green transition-all gap-2"
                >
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl font-bold text-cyber-green w-6 sm:w-8 text-center flex-shrink-0">#{index + 1}</span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-100 text-sm sm:text-base truncate">{score.adventureTitle}</p>
                      <p className="text-gray-400 text-xs">{new Date(score.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green" />
                    <span className="text-base sm:text-lg font-bold text-cyber-green">{score.score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Achievements Section */}
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4 sm:mb-6">
            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mr-2" />
            <h2 className="text-xl sm:text-2xl font-bold">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`cyber-card p-3 sm:p-4 md:p-6 text-center transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-400/50 bg-yellow-400/5'
                    : 'border-gray-600/50 bg-gray-800/20 opacity-60'
                }`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">{achievement.icon}</div>
                <h3 className={`font-bold mb-2 text-xs sm:text-sm ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {achievement.title}
                </h3>
                <p className="text-gray-400 text-xs">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2 sm:mt-3 inline-block px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-xs font-bold">
                    ✓ Unlocked
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Adventures Grid */}
      <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Choose Your Adventure</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {adventures.map((adventure: AdventureSummary, index: number) => (
              <AdventureCard key={adventure.id} {...adventure} index={index} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-3 sm:px-4 mt-8 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="cyber-card p-4 sm:p-6 md:p-8 max-w-3xl mx-auto"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-cyber-green mb-4 sm:mb-6">How It Works</h2>
          <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
            <div className="flex space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-cyber-green/20 text-cyber-green font-bold text-sm">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm sm:text-base">Read the Scenario</h3>
                <p className="text-xs sm:text-sm">Immerse yourself in a realistic cybersecurity situation with context and pressure.</p>
              </div>
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-cyber-green/20 text-cyber-green font-bold text-sm">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm sm:text-base">Make Your Choice</h3>
                <p className="text-xs sm:text-sm">Select your response to the security challenge. Safe choices earn you points.</p>
              </div>
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-cyber-green/20 text-cyber-green font-bold text-sm">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm sm:text-base">Learn the Outcome</h3>
                <p className="text-xs sm:text-sm">See the consequences of your decision and read detailed explanations linking to security principles.</p>
              </div>
            </div>
            <div className="flex space-x-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-cyber-green/20 text-cyber-green font-bold text-sm">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm sm:text-base">Unlock Achievements</h3>
                <p className="text-xs sm:text-sm">Complete adventures and reach score milestones to unlock special achievements. Compete for the top scores!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
