'use client'

import { useState } from 'react'

interface QuizProps {
  question: string
  options: { id: string; label: string; correct?: boolean }[]
}

export default function Quiz({ question, options }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => setSubmitted(true)

  const correct = submitted && options.find(o => o.id === selected)?.correct

  return (
    <div className="cyber-card p-6">
      <div className="font-semibold mb-4">{question}</div>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.id} className={`flex items-center gap-2 p-2 rounded border ${submitted ? (opt.correct ? 'border-cyber-green' : 'border-cyber-green/20') : 'border-cyber-green/30'} ${selected === opt.id ? 'bg-cyber-green/10' : ''}`}>
            <input
              type="radio"
              name="quiz"
              value={opt.id}
              disabled={submitted}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
            />
            <span className="text-gray-200">{opt.label}</span>
          </label>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={!selected} className="mt-4 px-4 py-2 border border-cyber-green/40 rounded text-cyber-green hover:bg-cyber-green/10 transition-colors disabled:opacity-50">Submit</button>
      ) : (
        <div className={`mt-4 text-sm ${correct ? 'text-cyber-green' : 'text-red-400'}`}>{correct ? 'Correct!' : 'Not quite. Review the article above and try again.'}</div>
      )}
    </div>
  )
}


