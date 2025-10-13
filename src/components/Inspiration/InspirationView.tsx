import { Button } from '@headlessui/react'
import { Inspiration } from '../../models/schema'
import styles from './InspirationView.module.css'

interface InspirationViewProps {
  inspirations: Inspiration[]
  onAddEditInspiration: (inspiration: Inspiration) => void
  onDeleteInspiration: (inspirationId: string) => void
}

export const InspirationView = ({
  inspirations,
  onAddEditInspiration,
  onDeleteInspiration,
}: InspirationViewProps) => {
  return inspirations.length > 0 ? (
    <ul className={styles.inspirationList}>
      {inspirations.map((inspiration) => (
        <div className={styles.inspirationItem} key={inspiration.id}>
          <li>{inspiration.websiteMetadata.urlRequested}</li>
          <div className={styles.buttonContainer}>
            <Button
              className={styles.editButton}
              onClick={() => onAddEditInspiration(inspiration)}
            >
              Edit
            </Button>
            <Button
              className={styles.deleteButton}
              onClick={() => onDeleteInspiration(inspiration.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </ul>
  ) : (
    <p>No inspirations added yet.</p>
  )
}
