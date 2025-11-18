'use client'

import { useState, useEffect } from 'react'
import SecurityAdventure from './SecurityAdventure'

interface AdventureData {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  scenario: string
  nodes: Record<string, any>
}

interface AdventureWrapperProps {
  adventure: any
}

export default function AdventureWrapper({ adventure }: AdventureWrapperProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleComplete = (score: number) => {
    // Save high score
    const newScore = {
      adventureId: adventure.id,
      adventureTitle: adventure.title,
      score: score,
      date: new Date().toISOString(),
    }

    // Get existing scores
    const existingScores = localStorage.getItem('adventureHighScores')
    const scores = existingScores ? JSON.parse(existingScores) : []
    scores.push(newScore)
    localStorage.setItem('adventureHighScores', JSON.stringify(scores))

    // Update total points
    const totalPoints = parseInt(localStorage.getItem('adventureTotalPoints') || '0') + score
    localStorage.setItem('adventureTotalPoints', totalPoints.toString())

    // Mark adventure as completed
    const completed = localStorage.getItem('adventureCompleted')
    const completedSet = completed ? new Set(JSON.parse(completed)) : new Set()
    completedSet.add(adventure.id)
    localStorage.setItem('adventureCompleted', JSON.stringify(Array.from(completedSet)))
  }

  if (!mounted) {
    return <div className="pt-20 pb-20 container mx-auto px-4 text-center text-gray-400">Loading...</div>
  }

  return <SecurityAdventure adventure={adventure as AdventureData} onComplete={handleComplete} />
}
