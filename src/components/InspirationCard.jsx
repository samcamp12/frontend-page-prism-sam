import clsx from 'clsx'
import Button from './Button'
import styles from './InspirationCard.module.css'

const getHostname = (url) => {
  if (!url) {
    return ''
  }

  try {
    const host = new URL(url)
    return host.hostname.replace(/^www\./, '')
  } catch (error) {
    return url
  }
}

const InspirationCard = ({
  inspiration,
  className,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  if (!inspiration) {
    return null
  }

  const { websiteMetadata = {}, screenshot_uri: screenshotUri, notes, updatedAt } =
    inspiration

  const title =
    websiteMetadata.title ||
    websiteMetadata.ogTitle ||
    websiteMetadata.url ||
    'Untitled Inspiration'
  const description = websiteMetadata.description || websiteMetadata.ogDescription || ''
  const hostname = getHostname(websiteMetadata.url)
  const timestamp = updatedAt
    ? new Date(updatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null

  return (
    <article className={clsx(styles.card, className)}>
      <div className={styles.media}>
        {screenshotUri ? (
          <img
            src={screenshotUri}
            alt={`Screenshot of ${title}`}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <span>No screenshot available</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <h3 className={styles.title}>{title}</h3>
            {hostname && (
              <a
                className={styles.url}
                href={websiteMetadata.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hostname}
              </a>
            )}
          </div>
          {timestamp && <p className={styles.timestamp}>Updated {timestamp}</p>}
        </header>

        {description && <p className={styles.description}>{description}</p>}
        {notes && <p className={styles.notes}>{notes}</p>}

        {showActions && (
          <footer className={styles.actions}>
            {onEdit && (
              <Button className={styles.editButton} onClick={() => onEdit(inspiration)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button className={styles.deleteButton} onClick={() => onDelete(inspiration)}>
                Delete
              </Button>
            )}
          </footer>
        )}
      </div>
    </article>
  )
}

export default InspirationCard

