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
  }) => Promise<void>
}

export const InspirationDialog = ({
  isOpen,
  closeDialog,
  onSaveInspiration,
}: InspirationDialogProps) => {
  const [inspirationUrl, setInspirationUrl] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const onUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInspirationUrl(e.target.value)
  }

  const onDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }

  const onNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }

  const handleSaveInspiration = async () => {
    try {
      await onSaveInspiration({
        url: inspirationUrl,
        date,
        notes,
      })
      setInspirationUrl('')
      setDate('')
      setNotes('')
      closeDialog()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onClose={closeDialog} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/40" />
        <div className={styles.dialogContainer}>
          <DialogPanel className={styles.dialogPanel}>
            <DialogTitle className={styles.dialogTitle}>
              Add Inspiration
            </DialogTitle>
            <hr className="-mx-8 my-4 border-t border-gray-200"></hr>
            <Field className={styles.field}>
              <Label className={styles.label}>
                Website URL<span className={'text-red-500'}>*</span>
              </Label>
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
                type="date"
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
              <Button className="flex-1" onClick={handleSaveInspiration}>
                Save
              </Button>
              <Button className="flex-1" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
