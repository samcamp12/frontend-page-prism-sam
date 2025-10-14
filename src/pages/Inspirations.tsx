import { useState } from 'react'
import { Inspiration, WebsiteMetadata } from '../models/schema'
import { Dialog, DialogPanel } from '@headlessui/react'
import { InspirationForm } from '../components/Inspiration/InspirationForm'
import { updateInspiration, createInspiration } from '../services/inspiration'
import { getMetadata } from '../utils/api'

import styles from './Inspiration.module.css'

export const Inspirations = ({ inspirations }) => {
  const [currentInspiration, setCurrentInspiration] = useState<
    Inspiration | undefined
  >()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveInspiration = async (
    websiteURI: string,
    date: string | null
  ) => {
    // TODO add error handling for invalid URL
    const websiteMetadata = (await getMetadata(
      websiteURI,
      date
    )) as WebsiteMetadata
    if (currentInspiration) {
      await updateInspiration(currentInspiration.id, {
        screenshot_uri: websiteURI,
        websiteMetadata: websiteMetadata,
      })
    } else {
      await createInspiration({
        projectId: '',
        screenshot_uri: websiteURI,
        websiteMetadata: websiteMetadata,
        notes: '',
      })
    }
    setCurrentInspiration(undefined)
    setIsDialogOpen(false)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <div>
        <span className={styles.label}>Inspirations</span>
        {inspirations.length > 0 ? (
          <ul className={styles.inspirationList}>
            {inspirations.map((inspiration) => (
              <div className={styles.inspirationItem} key={inspiration.id}>
                <li>{inspiration.websiteMetadata.urlRequested}</li>
              </div>
            ))}
          </ul>
        ) : (
          <p>No inspirations added yet.</p>
        )}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        as="div"
        className={styles.dialog}
      >
        <div className={styles.dialogContainer}>
          <DialogPanel className={styles.dialogPanel} transition>
            <InspirationForm
              onSaveInspiration={handleSaveInspiration}
              inspiration={currentInspiration}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
