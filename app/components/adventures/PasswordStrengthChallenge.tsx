'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function PasswordStrengthChallenge({ onComplete }: { onComplete: (score: number) => void }) {
  const [stage, setStage] = useState<'intro' | 'challenge' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const challenges = [
    {
      id: 'old',
      password: 'MyCompany2020!',
      question: 'This is your old breached password. What should you do?',
      options: [
        { text: 'Keep using it since you remember it', correct: false, feedback: '❌ It\'s already in breach databases!' },
        { text: 'Change it immediately on ALL accounts using it', correct: true, feedback: '✓ First priority in breach response!' },
        { text: 'Wait a few months then change it', correct: false, feedback: '❌ Every day of delay increases risk!' },
      ]
    },
    {
      id: 'new',
      password: 'Tr0pic@lSunset#2025',
      question: 'You created this new password. Is it strong enough?',
      options: [
        { text: 'Yes, it has uppercase, lowercase, numbers, and symbols', correct: true, feedback: '✓ 18 characters with all character types - excellent!' },
        { text: 'No, it\'s too long to remember', correct: false, feedback: '❌ Use a password manager! Longer is actually better.' },
        { text: 'No, it\'s too predictable (sunset, tropical themes)', correct: false, feedback: '⚠️  Has themes but still strong with 18 chars & symbols' },
      ]
    },
    {
      id: '2fa',
      password: 'NewP@ssw0rd123',
      question: 'You changed your password. What\'s the NEXT critical step?',
      options: [
        { text: 'Enable 2FA/MFA on the account', correct: true, feedback: '✓ 2FA stops attackers even if they have your password!' },
        { text: 'Tell your team about the password change', correct: false, feedback: '❌ Share via secure channel only, not email.' },
        { text: 'Log out of all devices', correct: false, feedback: '⚠️  Good practice but 2FA is more critical first.' },
      ]
    },
  ]

  const handleSelectAnswer = (challengeId: string, option: string) => {
    setAnswers({ ...answers, [challengeId]: option })
  }

  const handleSubmit = () => {
    let finalScore = 0
    challenges.forEach(challenge => {
      const selectedOption = challenge.options.find(opt => opt.text === answers[challenge.id])
      if (selectedOption?.correct) {
        finalScore += 30
      }
    })
    setScore(finalScore)
    setStage('results')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-cyber-darker to-cyber-dark py-8 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        {stage === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card p-8"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-cyber-green mr-3" />
              <h1 className="text-4xl font-bold text-cyber-green">Breach Response Challenge</h1>
            </div>
            <p className="text-gray-300 text-lg mb-8">
              Your password appears in a public breach database. You have limited time to respond correctly to minimize damage.
            </p>
            <button
              onClick={() => setStage('challenge')}
              className="cyber-button flex items-center"
            >
              Start Challenge <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === 'challenge' && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {challenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="cyber-card p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-cyber-green text-cyber-dark font-bold flex items-center justify-center mr-3">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold">{challenge.question}</h3>
                </div>
                <div className="bg-cyber-darkGray p-4 rounded mb-4 border border-cyber-blue/20">
                  <p className="font-mono text-cyber-blue">{challenge.password}</p>
                </div>
                <div className="space-y-3">
                  {challenge.options.map((option) => (
                    <motion.button
                      key={option.text}
                      onClick={() => handleSelectAnswer(challenge.id, option.text)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        answers[challenge.id] === option.text
                          ? 'border-cyber-green bg-cyber-green/10'
                          : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      {option.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < challenges.length}
              className="w-full cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          </motion.div>
        )}

        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card p-8"
          >
            <div className={`p-6 rounded-lg mb-8 text-center ${
              score >= 70 ? 'bg-green-400/10 border border-green-400' : 'bg-red-400/10 border border-red-400'
            }`}>
              <p className={`text-5xl font-bold mb-2 ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? '✓' : '❌'}
              </p>
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? 'Breach Contained!' : 'Damage Detected'}
              </p>
              <p className="text-gray-300 mt-2">Final Score: {score}/100 points</p>
            </div>

            <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-cyber-blue mb-3">🎓 Key Takeaway:</h3>
              <p className="text-gray-200">
                In a breach: (1) Change password immediately, (2) Enable 2FA, (3) Monitor for unauthorized access. Speed matters!
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('intro')
                  setAnswers({})
                  setScore(0)
                  onComplete(score)
                }}
                className="flex-1 cyber-button"
              >
                Try Again
              </button>
              <Link
                href="/adventures"
                className="flex-1 px-6 py-3 bg-cyber-darkGray hover:bg-cyber-green/10 text-cyber-green border border-cyber-green/30 font-bold rounded-lg transition-all text-center"
              >
                Back to Adventures
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
