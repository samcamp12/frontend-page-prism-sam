import { TrashIcon } from '@heroicons/react/16/solid'
import { Inspiration } from '../models/schema'

import styles from './InspirationCard.module.css'

interface InspirationCardProps {
  inspiration: Inspiration
  onDeleteInspiration: (id: string) => Promise<void>
}

export const InspirationCard = ({
  inspiration,
  onDeleteInspiration,
}: InspirationCardProps) => {
  const websiteData = inspiration.websiteMetadata

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {inspiration.screenshot_uri && (
          <img
            src={inspiration.screenshot_uri}
            alt={websiteData.urlResolved}
            className={styles.image}
          />
        )}
      </div>

      <div className={styles.title}>{websiteData.title}</div>
      {websiteData.ogUrl && (
        <a
          className={styles.url}
          href={websiteData.ogUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {websiteData.ogUrl}
        </a>
      )}
      <div>{inspiration.notes}</div>
      <div className={styles.bottomBar}>
        <div>{new Date(inspiration.updatedAt).toLocaleDateString()}</div>
        <TrashIcon
          className="size-6 text-red-500 cursor-pointer"
          onClick={() => {
            if (
              window.confirm(
                'Are you sure you want to delete this inspiration?'
              )
            ) {
              onDeleteInspiration(inspiration.id)
            }
          }}
        />
      </div>
    </div>
  )
}
