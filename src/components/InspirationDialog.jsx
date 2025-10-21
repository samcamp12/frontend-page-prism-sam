import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import InspirationForm from './InspirationForm'
import styles from './InspirationDialog.module.css'

const InspirationDialog = ({
  open,
  onClose,
  title = 'Save inspiration',
  description = 'Capture the context behind what inspired you about this page.',
  initialValues,
  metadata,
  screenshotUri,
  onSubmit,
  onFetchMetadata,
  isSubmitting = false,
  isFetchingMetadata = false,
  error = null,
  className,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.root} onClose={onClose}>
        <div className={styles.container}>
          <Transition.Child
            as={Fragment}
            enter={styles.overlayEnter}
            enterFrom={styles.overlayEnterFrom}
            enterTo={styles.overlayEnterTo}
            leave={styles.overlayLeave}
            leaveFrom={styles.overlayLeaveFrom}
            leaveTo={styles.overlayLeaveTo}
          >
            <Dialog.Overlay className={styles.overlay} />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter={styles.panelEnter}
            enterFrom={styles.panelEnterFrom}
            enterTo={styles.panelEnterTo}
            leave={styles.panelLeave}
            leaveFrom={styles.panelLeaveFrom}
            leaveTo={styles.panelLeaveTo}
          >
            <div className={clsx(styles.panel, className)}>
              <div className={styles.header}>
                <Dialog.Title className={styles.title}>{title}</Dialog.Title>
                {description && <p className={styles.description}>{description}</p>}
              </div>
              <InspirationForm
                initialValues={initialValues}
                metadata={metadata}
                screenshotUri={screenshotUri}
                onSubmit={onSubmit}
                onCancel={onClose}
                onFetchMetadata={onFetchMetadata}
                isSubmitting={isSubmitting}
                isFetchingMetadata={isFetchingMetadata}
                error={error}
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default InspirationDialog

