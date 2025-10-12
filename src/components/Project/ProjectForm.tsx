import {
  Button,
  Dialog,
  DialogPanel,
  Field,
  Input,
  Label,
  Textarea,
} from '@headlessui/react'

import styles from './projectForm.module.css'
import { useState } from 'react'
import { Inspiration, Project, WebsiteMetadata } from '../../models/schema'
import { InspirationForm } from '../Inspiration/InspirationForm'
import { getMetadata } from '../../utils/api'
import { createInspiration } from '../../services/inspiration'

interface ProjectFormProps {
  project: Project
  onSaveFormChange: (updates: Partial<Project>) => void
}

export const ProjectForm = ({
  project,
  onSaveFormChange,
}: ProjectFormProps) => {
  const [projectName, setProjectName] = useState(project.name)
  const [description, setDescription] = useState(project.description)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inspirations, setInspirations] = useState(project.inspirations ?? [])

  const onProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const onAddInspiration = () => {
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSaveInspiration = async (
    websiteURI: string,
    date: string | null
  ) => {
    const websiteMetadata = (await getMetadata(
      websiteURI,
      date
    )) as WebsiteMetadata

    console.log(websiteURI, date, websiteMetadata)
    const newInspiration: Inspiration = await createInspiration({
      projectId: project.id,
      screenshot_uri: websiteURI,
      websiteMetadata: websiteMetadata,
      notes: '',
    })
    setInspirations((inspirations) => [...inspirations, newInspiration])
    closeDialog()
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.heading}>
          <Field className={styles.field}>
            <Label className={styles.label}>Name</Label>
            <Input
              className={styles.input}
              value={projectName}
              onChange={onProjectNameChange}
            />
          </Field>
        </div>
        <div className={styles.description}>
          <Field className={styles.field}>
            <Label className={styles.label}>Description</Label>
            <Textarea
              className={styles.textarea}
              value={description}
              onChange={onDescriptionChange}
            />
          </Field>
        </div>
        <div className={styles.buttonContainer}>
          <Button className={styles.addButton} onClick={onAddInspiration}>
            Add Inspirations
          </Button>
          <Button
            className={styles.saveButton}
            onClick={() =>
              onSaveFormChange({
                name: projectName,
                description: description,
                inspirations: inspirations,
              })
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        as="div"
        className={styles.dialog}
      >
        <div className={styles.dialogContainer}>
          <DialogPanel className={styles.dialogPanel} transition>
            <InspirationForm onSaveInspiration={handleSaveInspiration} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
