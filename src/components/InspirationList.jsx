import clsx from 'clsx'
import InspirationCard from './InspirationCard'
import styles from './InspirationList.module.css'

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonMedia} />
    <div className={styles.skeletonContent}>
      <div className={styles.skeletonLineShort} />
      <div className={styles.skeletonLineLong} />
      <div className={styles.skeletonLineMedium} />
    </div>
  </div>
)

const InspirationList = ({
  inspirations = [],
  isLoading = false,
  emptyStateMessage = 'No inspirations yet. Start by capturing a website that inspired you.',
  onEdit,
  onDelete,
  className,
  showActions = true,
}) => {
  if (isLoading) {
    return (
      <div className={clsx(styles.wrapper, className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    )
  }

  if (!inspirations.length) {
    return (
      <div className={clsx(styles.emptyState, className)}>
        <p className={styles.emptyMessage}>{emptyStateMessage}</p>
      </div>
    )
  }

  return (
    <div className={clsx(styles.wrapper, className)}>
      {inspirations.map((inspiration) => (
        <InspirationCard
          key={inspiration.id}
          inspiration={inspiration}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  )
}

export default InspirationList

