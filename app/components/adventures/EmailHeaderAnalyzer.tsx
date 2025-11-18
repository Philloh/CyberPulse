'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'

export default function EmailHeaderAnalyzer({ onComplete }: { onComplete: (score: number) => void }) {
  const [stage, setStage] = useState<'intro' | 'analyze' | 'results'>('intro')
  const [score, setScore] = useState(0)
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([])

  const emailHeaders = [
    { id: 'spf', text: 'SPF: FAIL (domain does not match)', correct: true, explanation: 'This is a red flag! SPF failure means the sender IP is not authorized.' },
    { id: 'dmarc', text: 'DMARC: PASS', correct: false, explanation: 'DMARC passes but SPF fails - always verify multiple headers.' },
    { id: 'from', text: 'From: ceo@company.c0m (note the zero)', correct: true, explanation: 'Lookalike domain! Real domain is company.com, this is company.c0m.' },
    { id: 'reply', text: 'Reply-To: billing-verify.phish.com', correct: true, explanation: 'Reply address is completely different domain - classic phishing indicator.' },
    { id: 'date', text: 'Date: 2025-11-15 09:00:00 UTC', correct: false, explanation: 'Date looks normal, not necessarily suspicious on its own.' },
  ]

  const correctAnswers = ['spf', 'from', 'reply']

  const handleHeaderSelect = (id: string) => {
    if (selectedHeaders.includes(id)) {
      setSelectedHeaders(selectedHeaders.filter(h => h !== id))
    } else {
      setSelectedHeaders([...selectedHeaders, id])
    }
  }

  const handleSubmit = () => {
    let finalScore = 0
    let correct = 0

    correctAnswers.forEach(id => {
      if (selectedHeaders.includes(id)) {
        correct++
        finalScore += 30
      }
    })

    selectedHeaders.forEach(id => {
      if (!correctAnswers.includes(id)) {
        finalScore = Math.max(0, finalScore - 20)
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
            exit={{ opacity: 0, y: -20 }}
            className="cyber-card p-8"
          >
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-cyber-green mr-3" />
              <h1 className="text-4xl font-bold text-cyber-green">Email Header Analyzer</h1>
            </div>
            <p className="text-gray-300 text-lg mb-8">
              An urgent email arrived claiming to be from your CEO about billing issues. Before clicking anything, analyze the email headers to spot red flags.
            </p>
            <div className="bg-cyber-darkGray p-6 rounded-lg border border-cyber-blue/30 mb-8">
              <h2 className="text-xl font-bold text-cyber-blue mb-4">📧 The Suspicious Email:</h2>
              <div className="space-y-2 text-sm font-mono text-gray-200">
                <p>Subject: URGENT: Update billing details immediately!</p>
                <p>From: ceo@company.c0m</p>
                <p>To: you@company.com</p>
                <p>Date: 2025-11-15 09:00:00 UTC</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8">
              <strong>Your Task:</strong> Analyze the headers below. Select ALL the RED FLAGS that indicate this is a phishing email. Be careful - some headers may look normal!
            </p>
            <button
              onClick={() => setStage('analyze')}
              className="cyber-button flex items-center"
            >
              Start Analysis <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === 'analyze' && (
          <motion.div
            key="analyze"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="cyber-card p-8"
          >
            <h2 className="text-2xl font-bold text-cyber-green mb-6">Select the suspicious headers:</h2>
            <div className="space-y-4 mb-8">
              {emailHeaders.map((header) => (
                <motion.button
                  key={header.id}
                  onClick={() => handleHeaderSelect(header.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedHeaders.includes(header.id)
                      ? 'border-cyber-green bg-cyber-green/10'
                      : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">{header.text}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className={`w-6 h-6 rounded border-2 ${
                        selectedHeaders.includes(header.id)
                          ? 'bg-cyber-green border-cyber-green'
                          : 'border-gray-600'
                      }`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="cyber-button w-full"
            >
              Submit Analysis
            </button>
          </motion.div>
        )}

        {stage === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="cyber-card p-8"
          >
            <div className={`p-6 rounded-lg mb-8 text-center ${
              score >= 70 ? 'bg-green-400/10 border border-green-400' : 'bg-red-400/10 border border-red-400'
            }`}>
              <div className={`text-5xl font-bold mb-2 ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? '✓' : '❌'}
              </div>
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? 'Phishing Detected!' : 'You Were Fooled!'}
              </p>
              <p className="text-gray-300 mt-2">Final Score: {score}/100 points</p>
            </div>

            <div className="bg-cyber-darkGray p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-cyber-blue mb-4">📊 Analysis Breakdown:</h3>
              <div className="space-y-3">
                {emailHeaders.map((header) => (
                  <div key={header.id} className="flex items-start space-x-3">
                    <div>
                      {correctAnswers.includes(header.id) ? (
                        selectedHeaders.includes(header.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                        )
                      ) : (
                        <div className={`h-5 w-5 mt-1 flex-shrink-0 rounded-full ${
                          selectedHeaders.includes(header.id) ? 'bg-red-400' : 'bg-gray-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">{header.text}</p>
                      <p className="text-gray-400 text-sm">{header.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyber-blue/10 border border-cyber-blue/30 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-cyber-blue mb-3">🎓 Lesson Learned:</h3>
              <p className="text-gray-200">
                Always check email headers for SPF/DMARC failures, domain typos (c0m vs com), and mismatched reply addresses. These are the fastest ways to spot phishing before clicking malicious links!
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('intro')
                  setSelectedHeaders([])
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
