'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WiFiSecuritySimulator({ onComplete }: { onComplete: (score: number) => void }) {
  const [stage, setStage] = useState<'intro' | 'scenario' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [decisions, setDecisions] = useState<Record<string, boolean>>({})

  const scenarios = [
    {
      id: 'network-check',
      title: 'Network Security Status',
      description: 'Before connecting, check: Is this a legitimate coffee shop network?',
      action: 'Ask staff for official WiFi name and password',
      correct: true,
      explanation: 'Always verify network details with staff! Fake networks are common.',
      points: 25
    },
    {
      id: 'vpn-use',
      title: 'VPN Protection',
      description: 'You found the legitimate network. What should you do?',
      action: 'Connect VPN BEFORE opening any apps or emails',
      correct: true,
      explanation: 'VPN encrypts all traffic. Without it, passwords and data are exposed on open WiFi.',
      points: 30
    },
    {
      id: 'app-login',
      title: 'Banking Apps',
      description: 'You need to check your banking app. What\'s safe?',
      action: 'Use VPN first, then open banking app with 2FA enabled',
      correct: true,
      explanation: 'Banking apps over open WiFi without VPN = financial theft risk.',
      points: 20
    },
    {
      id: 'file-sharing',
      title: 'File Sharing Settings',
      description: 'Before leaving the café, you should:',
      action: 'Disable file sharing and turn off Bluetooth/AirDrop',
      correct: true,
      explanation: 'Open file sharing on public networks allows anyone to access your files!',
      points: 15
    },
    {
      id: 'email-check',
      title: 'Email & Cloud Sync',
      description: 'Your cloud sync is enabled. Is it safe?',
      action: 'Enable VPN first - cloud syncs should only happen over encrypted connections',
      correct: true,
      explanation: 'Sensitive documents can be intercepted during sync on open WiFi.',
      points: 10
    },
  ]

  const handleDecision = (id: string, isCorrect: boolean) => {
    setDecisions({ ...decisions, [id]: isCorrect })
  }

  const handleSubmit = () => {
    let finalScore = 0
    Object.entries(decisions).forEach(([id, isCorrect]) => {
      if (isCorrect) {
        const scenario = scenarios.find(s => s.id === id)
        if (scenario) finalScore += scenario.points
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
              <AlertTriangle className="h-8 w-8 text-yellow-400 mr-3" />
              <h1 className="text-4xl font-bold text-cyber-green">Public WiFi Security</h1>
            </div>
            <p className="text-gray-300 text-lg mb-8">
              You're at a coffee shop needing to check sensitive work emails. The WiFi is open. Make the right security decisions or risk a data breach.
            </p>
            <button
              onClick={() => setStage('scenario')}
              className="cyber-button flex items-center"
            >
              Start Scenario <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === 'scenario' && (
          <motion.div
            key="scenario"
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
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-cyber-green text-cyber-dark font-bold flex items-center justify-center mr-3">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-cyber-green">{scenario.title}</h3>
                  </div>
                  <p className="text-gray-300 ml-11">{scenario.description}</p>
                </div>

                <div className="space-y-3 mt-6">
                  <motion.button
                    onClick={() => handleDecision(scenario.id, scenario.correct)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      decisions[scenario.id] === true
                        ? 'border-green-400 bg-green-400/10'
                        : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-100">✓ {scenario.action}</p>
                      {decisions[scenario.id] === true && <CheckCircle className="h-5 w-5 text-green-400" />}
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleDecision(scenario.id, !scenario.correct)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      decisions[scenario.id] === false
                        ? 'border-red-400 bg-red-400/10'
                        : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-semibold text-gray-300">✗ Risk it (skip security)</p>
                  </motion.button>
                </div>
              </motion.div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={Object.keys(decisions).length < scenarios.length}
              className="w-full cyber-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Scenario
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
                {score >= 70 ? '✓' : '⚠️'}
              </p>
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? 'Secure Connection!' : 'Data At Risk!'}
              </p>
              <p className="text-gray-300 mt-2">Final Score: {score}/100 points</p>
            </div>

            <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-cyber-blue mb-3">🎓 Public WiFi Best Practices:</h3>
              <ul className="text-gray-200 space-y-2 text-sm">
                <li>✓ Always use a VPN before connecting to open WiFi</li>
                <li>✓ Verify network names with staff (prevent evil twin attacks)</li>
                <li>✓ Disable auto-connect and file sharing</li>
                <li>✓ Turn off Bluetooth and location services</li>
                <li>✓ Avoid financial/health apps on public networks</li>
                <li>✓ Use 2FA for all sensitive accounts</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('scenario')
                  setDecisions({})
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
