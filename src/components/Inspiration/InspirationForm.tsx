import { Field, Label, Input, Button } from '@headlessui/react'

import styles from './InspirationForm.module.css'
import { useState } from 'react'
import { Inspiration } from '../../models/schema'

interface InspirationFormProps {
  onSaveInspiration: (websiteURI: string, date: string | null) => void
  inspiration?: Inspiration
}

export const InspirationForm = ({
  onSaveInspiration,
  inspiration,
}: InspirationFormProps) => {
  const [websiteURI, setWebsiteURI] = useState<string>(
    inspiration?.websiteMetadata.urlRequested ?? ''
  )
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
          placeholder="bbc.co.uk"
          spellCheck={false}
        />
      </Field>
      <Field className={styles.field}>
        <Label className={styles.label}>{'Capture Date (Optional)'}</Label>
        <Input
          className={styles.input}
          type="month"
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
