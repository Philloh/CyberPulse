'use client'

import { useMemo, useState } from 'react'

interface PollOption {
  id: string
  label: string
}

interface PollProps {
  question: string
  options: PollOption[]
}

export default function Poll({ question, options }: PollProps) {
  const [votes, setVotes] = useState<Record<string, number>>(() => Object.fromEntries(options.map(o => [o.id, 0])))
  const [selected, setSelected] = useState<string | null>(null)
  const total = useMemo(() => Object.values(votes).reduce((a, b) => a + b, 0), [votes])

  const handleVote = (id: string) => {
    if (selected) return
    setVotes((v) => ({ ...v, [id]: (v[id] || 0) + 1 }))
    setSelected(id)
  }

  return (
    <div className="cyber-card p-6">
      <div className="font-semibold mb-4">{question}</div>
      <div className="space-y-3">
        {options.map((opt) => {
          const count = votes[opt.id] || 0
          const pct = total ? Math.round((count / total) * 100) : 0
          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={!!selected}
              className={`w-full text-left border border-cyber-green/30 rounded-lg p-3 hover:bg-cyber-green/10 transition-colors ${selected ? 'cursor-default' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-200">{opt.label}</span>
                <span className="text-sm text-gray-400">{pct}%</span>
              </div>
              <div className="mt-2 h-2 bg-cyber-dark rounded overflow-hidden">
                <div className="h-full bg-cyber-green" style={{ width: pct + '%' }} />
              </div>
            </button>
          )
        })}
      </div>
      {selected && <div className="mt-3 text-sm text-gray-400">Thanks for voting!</div>}
    </div>
  )
}


