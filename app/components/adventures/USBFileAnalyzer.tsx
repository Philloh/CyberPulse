'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function USBFileAnalyzer({ onComplete }: { onComplete: (score: number) => void }) {
  const [stage, setStage] = useState<'intro' | 'scanning' | 'analysis'>('intro')
  const [score, setScore] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [analyzed, setAnalyzed] = useState(false)

  const files = [
    {
      id: 'invoice.exe',
      name: 'Invoice_2025.exe',
      size: '2.3 MB',
      type: 'Executable',
      dangerous: true,
      explanation: 'DANGER: Executable file disguised as document. This is likely malware!',
      points: 40
    },
    {
      id: 'autorun.inf',
      name: 'autorun.inf',
      size: '512 bytes',
      type: 'System Config',
      dangerous: true,
      explanation: 'DANGER: Autorun file executes on connect. Classic malware delivery mechanism.',
      points: 40
    },
    {
      id: 'readme.txt',
      name: 'README.txt',
      size: '1.2 KB',
      type: 'Text',
      dangerous: false,
      explanation: 'Safe: Regular text file. Content appears benign.',
      points: 0
    },
    {
      id: 'credentials.xlsx',
      name: 'Credentials.xlsx',
      size: '150 KB',
      type: 'Spreadsheet',
      dangerous: true,
      explanation: 'DANGER: Spreadsheet with potentially harvested credentials. Do not open!',
      points: 30
    },
    {
      id: 'presentation.pdf',
      name: 'Presentation.pdf',
      size: '8.5 MB',
      type: 'Document',
      dangerous: false,
      explanation: 'Appears safe, but could contain embedded exploits. Treat with caution.',
      points: 0
    },
  ]

  const dangerousFiles = files.filter(f => f.dangerous).map(f => f.id)

  const handleSelectFile = (id: string) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(f => f !== id))
    } else {
      setSelectedFiles([...selectedFiles, id])
    }
  }

  const handleAnalyze = () => {
    let finalScore = 0

    dangerousFiles.forEach(id => {
      if (selectedFiles.includes(id)) {
        const file = files.find(f => f.id === id)
        if (file) finalScore += file.points
      }
    })

    selectedFiles.forEach(id => {
      if (!dangerousFiles.includes(id)) {
        finalScore = Math.max(0, finalScore - 15)
      }
    })

    setScore(Math.max(0, finalScore))
    setAnalyzed(true)
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
              <h1 className="text-4xl font-bold text-cyber-green">USB Drop Analysis</h1>
            </div>
            <p className="text-gray-300 text-lg mb-6">
              You found a USB stick in the parking lot. Instead of plugging it directly into your computer (bad idea!), you analyzed it on an isolated machine. Now you need to identify which files are dangerous.
            </p>
            <div className="bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-lg mb-8">
              <p className="text-yellow-300 font-semibold">⚠️ Golden Rule: NEVER plug found USB into work computer!</p>
            </div>
            <button
              onClick={() => setStage('analysis')}
              className="cyber-button flex items-center"
            >
              Analyze Files <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        )}

        {stage === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="cyber-card p-6 mb-6"
            >
              <h2 className="text-2xl font-bold text-cyber-green mb-2">🔍 File Contents:</h2>
              <p className="text-gray-300">Select ALL files you would DELETE or QUARANTINE (not open):</p>
            </motion.div>

            <div className="space-y-3">
              {files.map((file, idx) => (
                <motion.button
                  key={file.id}
                  onClick={() => handleSelectFile(file.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedFiles.includes(file.id)
                      ? 'border-red-400 bg-red-400/10'
                      : 'border-gray-600 bg-cyber-darkGray hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-100">{file.name}</p>
                      <div className="flex gap-4 text-xs text-gray-400 mt-2">
                        <span>📄 {file.type}</span>
                        <span>💾 {file.size}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className={`w-6 h-6 rounded border-2 ${
                        selectedFiles.includes(file.id)
                          ? 'bg-red-400 border-red-400'
                          : 'border-gray-600'
                      }`} />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              className="w-full cyber-button mt-6"
            >
              Submit Analysis
            </button>
          </motion.div>
        )}

        {analyzed && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.div className={`cyber-card p-8 text-center ${
              score >= 70 ? 'border-green-400/50' : 'border-red-400/50'
            }`}>
              <p className={`text-5xl font-bold mb-2 ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? '✓' : '⚠️'}
              </p>
              <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                {score >= 70 ? 'Malware Detected!' : 'Some Threats Missed'}
              </p>
              <p className="text-gray-300 mt-2">Final Score: {score}/110 points</p>
            </motion.div>

            <motion.div className="cyber-card p-6 space-y-4">
              <h3 className="text-xl font-bold text-cyber-blue">📋 File-by-File Analysis:</h3>
              {files.map((file) => (
                <div key={file.id} className="border-b border-gray-700 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-100">{file.name}</p>
                    {selectedFiles.includes(file.id) && file.dangerous && (
                      <span className="text-green-400 text-sm font-bold">✓ Correctly identified</span>
                    )}
                    {!selectedFiles.includes(file.id) && file.dangerous && (
                      <span className="text-red-400 text-sm font-bold">✗ Missed this threat!</span>
                    )}
                  </div>
                  <p className={`text-sm ${file.dangerous ? 'text-red-300' : 'text-gray-400'}`}>
                    {file.explanation}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div className="cyber-card p-6 bg-cyber-blue/10 border border-cyber-blue/30">
              <h3 className="text-lg font-bold text-cyber-blue mb-3">🎓 Safe USB Protocol:</h3>
              <ul className="text-gray-200 space-y-2 text-sm">
                <li>✓ Never plug found USB into work computer (EVER)</li>
                <li>✓ Use isolated/sandboxed environment or lab machine</li>
                <li>✓ Check file types and extensions first</li>
                <li>✓ Look for executable files (.exe, .bat, .inf)</li>
                <li>✓ Delete or quarantine suspicious files immediately</li>
              </ul>
            </motion.div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStage('analysis')
                  setSelectedFiles([])
                  setAnalyzed(false)
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
