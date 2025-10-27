import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Textarea,
} from '@headlessui/react'
import Button from './Button'
import { ChangeEvent, useState } from 'react'

import styles from './InspirationDialog.module.css'

interface InspirationDialogProps {
  isOpen: boolean
  closeDialog: () => void
  onSaveInspiration: (data: {
    url: string
    date: string
    notes: string
  }) => void
}

export const InspirationDialog = ({
  isOpen,
  closeDialog,
  onSaveInspiration,
}: InspirationDialogProps) => {
  const [inspirationUrl, setInspirationUrl] = useState<string>()
  const [date, setDate] = useState<string>()
  const [notes, setNotes] = useState<string>()

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInspirationUrl(e.target.value)
  }

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const onNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  return (
    <>
      <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">Add Inspiration</DialogTitle>
            <Field className={styles.field}>
              <Label className={styles.label}>Website URL</Label>
              <Input
                value={inspirationUrl}
                onChange={onUrlChange}
                className={styles.input}
              />
            </Field>
            <Field className={styles.field}>
              <Label className={styles.label}>
                {'Archive Date (optional)'}
              </Label>
              <Input
                value={date}
                onChange={onDateChange}
                className={styles.input}
              />
            </Field>
            <Field className={styles.field}>
              <Label className={styles.label}>Notes</Label>
              <Textarea
                value={notes}
                onChange={onNotesChange}
                className={styles.textarea}
              />
            </Field>
            <div className="flex gap-4">
              <Button onClick={onSaveInspiration}>Save</Button>
              <Button onClick={closeDialog}>Cancel</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
