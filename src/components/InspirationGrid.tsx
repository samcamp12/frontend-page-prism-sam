import { Inspiration } from '../models/schema'
import { InspirationCard } from './InspirationCard'

interface InspirationGridProps {
  inspirations: Inspiration[]
  refreshProject: () => Promise<void>
  onDeleteInspiration: (id: string) => Promise<void>
}

export const InspirationGrid = ({
  inspirations,
  onDeleteInspiration,
}: InspirationGridProps) => {
  return (
    <div
      className={
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center'
      }
    >
      {inspirations && inspirations.length > 0 ? (
        inspirations.map((inspiration) => {
          return (
            <InspirationCard
              inspiration={inspiration}
              key={inspiration.id}
              onDeleteInspiration={onDeleteInspiration}
            />
          )
        })
      ) : (
        <p>No inspirations added yet.</p>
      )}
    </div>
  )
}
