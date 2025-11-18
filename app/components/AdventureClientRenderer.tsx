'use client'

import AdventureWrapper from './AdventureWrapper'

export default function AdventureClientRenderer({ adventure }: { adventure: any }) {
  return <AdventureWrapper adventure={adventure} />
}
