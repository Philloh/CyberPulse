'use client'

interface Datum {
  label: string
  value: number
}

interface Props {
  title?: string
  data: Datum[]
  max?: number
}

export default function ThreatBarChart({ title = 'Threat Stats', data, max }: Props) {
  const maxValue = max ?? Math.max(1, ...data.map(d => d.value))
  return (
    <div className="cyber-card p-6">
      <div className="font-semibold mb-4">{title}</div>
      <div className="space-y-3">
        {data.map((d) => {
          const pct = Math.round((d.value / maxValue) * 100)
          return (
            <div key={d.label}>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>{d.label}</span>
                <span>{d.value}</span>
              </div>
              <div className="h-2 bg-cyber-dark rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyber-blue to-cyber-green" style={{ width: pct + '%' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


