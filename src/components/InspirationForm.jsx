import { useEffect, useState } from 'react'
import clsx from 'clsx'
import Button from './Button'
import styles from './InspirationForm.module.css'

const defaultValues = {
  url: '',
  notes: '',
}

const InspirationForm = ({
  initialValues = defaultValues,
  metadata = null,
  screenshotUri = null,
  onSubmit,
  onCancel,
  onFetchMetadata,
  isSubmitting = false,
  isFetchingMetadata = false,
  error = null,
  className,
}) => {
  const [url, setUrl] = useState(initialValues.url ?? defaultValues.url)
  const [notes, setNotes] = useState(initialValues.notes ?? defaultValues.notes)

  useEffect(() => {
    setUrl(initialValues.url ?? defaultValues.url)
    setNotes(initialValues.notes ?? defaultValues.notes)
  }, [initialValues.url, initialValues.notes])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onSubmit) {
      return
    }
    try {
      await onSubmit({
        url: url.trim(),
        notes: notes.trim(),
      })
    } catch (error) {
      // Parent component is responsible for surfacing the error state.
    }
  }

  const handleFetchMetadata = async () => {
    if (!onFetchMetadata || !url.trim()) {
      return
    }
    await onFetchMetadata(url.trim())
  }

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label htmlFor="inspiration-url" className={styles.label}>
          Website URL
        </label>
        <div className={styles.fieldRow}>
          <input
            id="inspiration-url"
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className={styles.input}
            autoComplete="off"
          />
          {onFetchMetadata && (
            <button
              type="button"
              className={styles.previewButton}
              onClick={handleFetchMetadata}
              disabled={isFetchingMetadata || !url.trim()}
            >
              {isFetchingMetadata ? 'Fetching…' : 'Fetch preview'}
            </button>
          )}
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="inspiration-notes" className={styles.label}>
          Notes
        </label>
        <textarea
          id="inspiration-notes"
          rows={4}
          placeholder="Capture what inspired you about this page…"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className={clsx(styles.input, styles.textarea)}
        />
      </div>

      {(metadata || screenshotUri) && (
        <div className={styles.preview}>
          {metadata && (
            <div className={styles.previewContent}>
              <p className={styles.previewTitle}>
                {metadata.title || metadata.ogTitle || metadata.url || 'Untitled'}
              </p>
              {(metadata.description || metadata.ogDescription) && (
                <p className={styles.previewDescription}>
                  {metadata.description || metadata.ogDescription}
                </p>
              )}
              {metadata.url && (
                <a
                  href={metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.previewLink}
                >
                  {metadata.url}
                </a>
              )}
            </div>
          )}

          {screenshotUri && (
            <div className={styles.previewScreenshot}>
              <img src={screenshotUri} alt="Website preview" />
            </div>
          )}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        {onCancel && (
          <Button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save inspiration'}
        </Button>
      </div>
    </form>
  )
}

export default InspirationForm

