'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Award, Zap } from 'lucide-react'

interface AdventureCardProps {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  index: number
}

const difficultyColors = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
}

const difficultyIcons = {
  Easy: '🟢',
  Medium: '🟡',
  Hard: '🔴',
}

export default function AdventureCard({
  id,
  title,
  description,
  difficulty,
  index,
}: AdventureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        href={`/adventures/${id}`}
        className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-green rounded-xl"
      >
        <article className="cyber-card p-3 sm:p-4 md:p-6 hover:border-cyber-green hover:shadow-lg hover:shadow-cyber-green/20 transition-all cursor-pointer h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-100 group-hover:text-cyber-green transition-colors flex-1 leading-tight">
              {title}
            </h3>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${difficultyColors[difficulty]}`}>
              {difficultyIcons[difficulty]} {difficulty}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 flex-grow line-clamp-2">
            {description}
          </p>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 pt-3 sm:pt-4 border-t border-cyber-green/10">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-cyber-green flex-shrink-0" />
                <span className="truncate">Interactive</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 text-cyber-green flex-shrink-0" />
                <span className="truncate">Achievements</span>
              </span>
            </div>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green/50 group-hover:text-cyber-green group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
