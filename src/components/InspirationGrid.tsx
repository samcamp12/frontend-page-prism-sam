import { Inspiration } from '../models/schema'
import { InspirationCard } from './InspirationCard'

import styles from './InspirationGrid.module.css'

interface InspirationGridProps {
  inspirations: Inspiration[]
}

export const InspirationGrid = ({ inspirations }: InspirationGridProps) => {
  return (
    <div className={styles.container}>
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
