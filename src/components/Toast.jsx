import clsx from 'clsx'
import styles from './Toast.module.css'

const Toast = ({ toast, onDismiss }) => {
  if (!toast) {
    return null
  }

  const { title, description, variant = 'neutral', action } = toast

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick()
    }
    if (!action?.persistOnAction) {
      onDismiss?.()
    }
  }

  return (
    <div className={clsx(styles.toast, styles[variant])}>
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.controls}>
        {action?.label && (
          <button type="button" className={styles.actionButton} onClick={handleAction}>
            {action.label}
          </button>
        )}
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast

