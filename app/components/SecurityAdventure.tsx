'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Award, Zap, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Choice {
  text: string
  nextNode: string
  points: number
}

interface Node {
  text: string
  choices?: Choice[]
  outcome?: 'SUCCESS' | 'FAILURE' | 'PARTIAL_SUCCESS'
  lesson?: string
  relatedArticle?: string
  finalScore?: number
  level?: string
}

interface Adventure {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  scenario: string
  nodes: Record<string, Node>
}

interface SecurityAdventureProps {
  adventure: Adventure
  onComplete?: (score: number) => void
}

const difficultyColors = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
}

const difficultyBgColors = {
  Easy: 'bg-green-400/10',
  Medium: 'bg-yellow-400/10',
  Hard: 'bg-red-400/10',
}

const outcomeEmojis = {
  SUCCESS: '✓',
  FAILURE: '❌',
  PARTIAL_SUCCESS: '⚡',
}

export default function SecurityAdventure({ adventure, onComplete }: SecurityAdventureProps) {
  const [currentNode, setCurrentNode] = useState('start')
  const [score, setScore] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [visited, setVisited] = useState<Set<string>>(new Set(['start']))
  const [decisions, setDecisions] = useState<string[]>([])

  const node = adventure.nodes[currentNode]

  const handleChoice = (choice: Choice) => {
    const newScore = score + choice.points
    setScore(newScore)
    setDecisions([...decisions, choice.text])
    setCurrentNode(choice.nextNode)
    setVisited(new Set([...visited, choice.nextNode]))
  }

  const handleRestart = () => {
    setCurrentNode('start')
    setScore(0)
    setGameEnded(false)
    setVisited(new Set(['start']))
    setDecisions([])
  }

  useEffect(() => {
    if (node && !node.choices) {
      setGameEnded(true)
      if (onComplete) {
        onComplete(node.finalScore || 0)
      }
    }
  }, [currentNode, node, onComplete])

  if (!node) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Adventure node not found</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-cyber-darker to-cyber-dark py-4 px-3 sm:py-6 sm:px-4 lg:py-8"
    >
      <div className="container mx-auto max-w-4xl w-full px-2 sm:px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <Link href="/adventures" className="flex items-center space-x-2 text-cyber-green hover:text-cyber-blue transition-colors text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Back to Adventures</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-cyber-green/10 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green flex-shrink-0" />
              <span className="text-cyber-green font-bold">{score} points</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          key={currentNode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="cyber-card p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
        >
          {/* Adventure Title and Difficulty */}
          {currentNode === 'start' && (
            <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-cyber-green/20">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyber-green break-words">{adventure.title}</h1>
                <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm whitespace-nowrap ${difficultyBgColors[adventure.difficulty]} ${difficultyColors[adventure.difficulty]}`}>
                  {adventure.difficulty}
                </span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">{adventure.description}</p>
            </div>
          )}

          {/* Outcome Badge */}
          {gameEnded && node.outcome && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg text-center ${
                node.outcome === 'SUCCESS'
                  ? 'bg-green-400/10 border border-green-400'
                  : node.outcome === 'FAILURE'
                  ? 'bg-red-400/10 border border-red-400'
                  : 'bg-yellow-400/10 border border-yellow-400'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{outcomeEmojis[node.outcome]}</div>
              <p className={`text-lg sm:text-xl font-bold ${
                node.outcome === 'SUCCESS'
                  ? 'text-green-400'
                  : node.outcome === 'FAILURE'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }`}>
                {node.outcome === 'SUCCESS'
                  ? 'Perfect Response!'
                  : node.outcome === 'FAILURE'
                  ? 'Breach Detected!'
                  : 'Partial Success'}
              </p>
            </motion.div>
          )}

          {/* Scenario or Story Text */}
          {currentNode === 'start' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8 p-4 sm:p-6 bg-cyber-darkGray rounded-lg border border-cyber-blue/20"
            >
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg leading-relaxed">{adventure.scenario}</p>
            </motion.div>
          )}

          {/* Current Node Text */}
          {node.level && (
            <p className="text-xs sm:text-sm text-cyber-green font-semibold tracking-wide uppercase mb-2">{node.level}</p>
          )}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100 mb-4 sm:mb-6 leading-snug">{node.text}</h2>

          {/* Lesson Section (for end nodes) */}
          {gameEnded && node.lesson && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6 sm:mb-8 p-4 sm:p-6 bg-cyber-blue/10 rounded-lg border border-cyber-blue/30"
            >
              <h3 className="text-base sm:text-lg font-bold text-cyber-blue mb-3">📚 Learning Outcome</h3>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-4">{node.lesson}</p>
              {node.relatedArticle && (
                <Link
                  href={`/blog?search=${encodeURIComponent(node.relatedArticle)}`}
                  className="inline-block text-cyber-green hover:text-cyber-blue transition-colors underline text-sm sm:text-base"
                >
                  → Read: {node.relatedArticle}
                </Link>
              )}
            </motion.div>
          )}

          {/* Score Display for End Nodes */}
          {gameEnded && node.finalScore !== undefined && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-cyber-green/10 rounded-lg border border-cyber-green/30 text-center">
              <p className="text-gray-300 text-xs sm:text-sm mb-2 font-semibold">FINAL SURVIVAL POINTS</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyber-green">{node.finalScore}</p>
            </div>
          )}

          {/* Choices */}
          <AnimatePresence>
            {!gameEnded && node.choices && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              >
                {node.choices.map((choice, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-3 sm:p-4 rounded-lg border border-cyber-green/30 bg-cyber-darkGray hover:bg-cyber-green/10 hover:border-cyber-green transition-all group active:scale-98"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-gray-100 text-sm sm:text-base font-medium group-hover:text-cyber-green transition-colors break-words flex-1">
                        {choice.text}
                      </span>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-cyber-green/50 group-hover:text-cyber-green group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* End Game Actions */}
          {gameEnded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <button
                onClick={handleRestart}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-cyber-green hover:bg-cyber-blue text-cyber-dark font-bold rounded-lg transition-all transform hover:scale-105 text-sm sm:text-base active:scale-95"
              >
                Replay Adventure
              </button>
              <Link
                href="/adventures"
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-cyber-darkGray hover:bg-cyber-green/10 text-cyber-green border border-cyber-green/30 font-bold rounded-lg transition-all text-center text-sm sm:text-base"
              >
                Try Another
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Indicator */}
        {!gameEnded && (
          <div className="text-center text-gray-400 text-xs sm:text-sm">
            <p>Decisions made: {decisions.length}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
