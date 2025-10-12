import { Field, Label, Input, Button } from '@headlessui/react'

import styles from './InspirationForm.module.css'
import { useState } from 'react'

interface InspirationFormProps {
  onSaveInspiration: (websiteURI: string, date: string | null) => void
}

export const InspirationForm = ({
  onSaveInspiration,
}: InspirationFormProps) => {
  const [websiteURI, setWebsiteURI] = useState<string>('')
  const [date, setDate] = useState<string | null>(null)

  const onWebsiteURIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteURI(e.target.value)
  }

  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }
  return (
    <div className={styles.container}>
      <Field className={styles.field}>
        <Label className={styles.label}>Website URL</Label>
        <Input
          className={styles.input}
          value={websiteURI}
          onChange={onWebsiteURIChange}
          type="url"
          inputMode="url"
          autoCapitalize="off"
          autoCorrect="off"
          placeholder="https://example.com"
          spellCheck={false}
        />
      </Field>
      <Field className={styles.field}>
        <Label className={styles.label}>{'Capture Date (Optional)'}</Label>
        <Input
          className={styles.input}
          type="date"
          value={date ?? ''}
          onChange={onDateChange}
        />
      </Field>
      <div className={styles.saveButton}>
        <Button onClick={() => onSaveInspiration(websiteURI, date)}>
          Save Inspiration
        </Button>
      </div>
    </div>
  )
}
