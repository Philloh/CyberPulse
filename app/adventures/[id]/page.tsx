import adventuresData from '../../../data/adventures.json'
import type { Metadata } from 'next'
import AdventureClientRenderer from '../../components/AdventureClientRenderer'

export const revalidate = false

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const adventure = adventuresData.adventures.find((a) => a.id === params.id)
  
  if (!adventure) {
    return {
      title: 'Adventure Not Found',
    }
  }

  return {
    title: `${adventure.title} - CyberPulse KE`,
    description: adventure.description,
  }
}

export const generateStaticParams = async () => {
  return adventuresData.adventures.map((adventure) => ({
    id: adventure.id,
  }))
}

export default function AdventurePage({ params }: { params: { id: string } }) {
  const adventureId = String(params.id)
  const adventure = adventuresData.adventures.find((a) => a.id === adventureId)

  if (!adventure) {
    return (
      <div className="pt-20 pb-20 container mx-auto px-4">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Adventure Not Found</h1>
          <p className="text-gray-400">Sorry, this adventure doesn't exist. ID: {adventureId}</p>
        </div>
      </div>
    )
  }

  return (
    <AdventureClientRenderer id={adventureId} adventure={adventure} />
  )
}
