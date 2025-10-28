import { Inspiration } from '../models/schema'
import { InspirationCard } from './InspirationCard'

interface InspirationGridProps {
  inspirations: Inspiration[]
}

export const InspirationGrid = ({ inspirations }: InspirationGridProps) => {
  return (
    <div className={'grid grid-cols-3 gap-4'}>
      {inspirations && inspirations.length > 0 ? (
        inspirations.map((inspiration) => {
          return (
            <InspirationCard inspiration={inspiration} key={inspiration.id} />
          )
        })
      ) : (
        <p>No inspirations added yet.</p>
      )}
    </div>
  )
}
