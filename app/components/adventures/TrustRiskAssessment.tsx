'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function TrustRiskAssessment({ onComplete }: { onComplete: (score: number) => void }) {
  const [stage, setStage] = useState<'intro' | 'scenarios' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const scenarios = [
    {
      id: 'data-request',
      situation: 'A colleague you trust asks: "Can you send me the customer database? My access is temporarily revoked."',
      correct: 'Verify with their manager and IT - never share directly',
      options: [
        { text: 'Send it - they\'re a trusted colleague', correct: false },
        { text: 'Verify with their manager and IT first', correct: true },
        { text: 'Ask for their password to check themselves', correct: false },
      ]
    },
    {
      id: 'lunch-access',
      situation: 'Your manager asks: "I forgot my badge. Can I use your card to get into the server room?"',
      correct: 'Politely decline and suggest they get a temporary badge from security',
      options: [
        { text: 'Let them use your card', correct: false },
        { text: 'Suggest they get a temporary badge from security', correct: true },
        { text: 'Follow them in but don\'t let them touch anything', correct: false },
      ]
    },
    {
      id: 'password-help',
      situation: 'A new hire says: "I forgot my password, can you reset it for me?"',
      correct: 'Direct them to use the self-service password reset or contact IT help desk',
      options: [
        { text: 'Reset it yourself', correct: false },
        { text: 'Direct them to IT help desk or self-service', correct: true },
        { text: 'Give them a temporary password verbally', correct: false },
      ]
    },
    {
      id: 'usb-request',
      situation: 'Someone leaving the company asks: "Can I borrow a USB to transfer my files home?"',
      correct: 'Provide a company-approved USB and ensure they follow data handling procedures',
      options: [
        { text: 'Give them your personal USB', correct: false },
        { text: 'Offer company USB and verify through IT procedures', correct: true },
        { text: 'Refuse completely', correct: false },
      ]
    },
    {
      id: 'call-verify',
      situation: 'Someone calls claiming to be from IT asking for your login credentials to "update your access"',
      correct: 'Hang up and call IT back using the official number to verify',
      options: [
        { text: 'Give them your credentials', correct: false },
        { text: 'Hang up and verify with IT using official number', correct: true },
        { text: 'Ask for their credentials first', correct: false },
      ]
    },
  ]

  const handleSelectAnswer = (scenarioId: string, option: string) => {
    setAnswers({ ...answers, [scenarioId]: option })
  }

  const handleSubmit = () => {
    let finalScore = 0
    scenarios.forEach(scenario => {
      const selectedOption = scenario.options.find(opt => opt.text === answers[scenario.id])
      if (selectedOption?.correct) {
        finalScore += 20
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
              <h1 className="text-4xl font-bold text-cyber-green">Trust vs. Security</h1>
            </div>
            <p className="text-gray-300 text-lg mb-8">
              Your biggest security risk isn't hackers - it's well-meaning colleagues who don't follow procedures. Learn to balance trust with security protocols.
            </p>
            <button
              onClick={() => setStage('scenarios')}
              className="cyber-button flex items-center"
            >
              Test Your Security Awareness <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === 'scenarios' && (
          <motion.div
            key="scenarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {scenarios.map((scenario, idx) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="cyber-card p-6"
              >
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="w-8 h-8 rounded-full bg-cyber-green text-cyber-dark font-bold flex items-center justify-center mr-3">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-100">Scenario {idx + 1}</h3>
                  </div>
                  <div className="bg-cyber-darkGray p-4 rounded-lg border-l-4 border-cyber-blue ml-11">
                    <p className="text-gray-200 italic">"{scenario.situation}"</p>
                  </div>
                </div>

                <p className="text-gray-300 font-semibold mb-4">What do you do?</p>
                <div className="space-y-3">
                  {scenario.options.map((option) => (
                    <motion.button
                      key={option.text}
                      onClick={() => handleSelectAnswer(scenario.id, option.text)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        answers[scenario.id] === option.text
                          ? 'border-cyber-green bg-cyber-green/10'
                          : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="font-semibold text-gray-100">{option.text}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < scenarios.length}
              className="w-full cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Assessment
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
              score >= 70 ? 'bg-green-400/10 border border-green-400' : 'bg-yellow-400/10 border border-yellow-400'
            }`}>
              <p className={`text-5xl font-bold mb-2 ${score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                {score >= 70 ? '✓' : '⚠️'}
              </p>
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                {score >= 70 ? 'Security Conscious!' : 'Room for Improvement'}
              </p>
              <p className="text-gray-300 mt-2">Final Score: {score}/100 points</p>
            </div>

            <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-cyber-blue mb-3">🎓 Golden Rules:</h3>
              <ul className="text-gray-200 space-y-2 text-sm">
                <li>✓ Never share access credentials, even with trusted colleagues</li>
                <li>✓ Always verify through official channels and procedures</li>
                <li>✓ Never provide physical access to secure areas to anyone</li>
                <li>✓ Social engineering exploits TRUST - don't be embarrassed to verify</li>
                <li>✓ When in doubt, contact IT security - it's their job</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('scenarios')
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
