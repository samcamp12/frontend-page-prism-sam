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
import {
  createInspiration,
  deleteInspiration,
  updateInspiration,
} from '../../services/inspiration'
import { InspirationView } from '../Inspiration/InspirationView'

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
  const [currentInspiration, setCurrentInspiration] = useState<
    Inspiration | undefined
  >()

  const onProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const onAddEditInspiration = (inspiration?: Inspiration) => {
    if (inspiration) {
      setCurrentInspiration(inspiration)
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

  const onDeleteInspiration = async (inspirationId: string) => {
    await deleteInspiration(inspirationId)
    onSaveFormChange({
      name: projectName,
      description: description,
      inspirations: inspirations.filter(
        (inspiration) => inspiration.id !== inspirationId
      ),
    })
    setCurrentInspiration(undefined)
  }

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
      const updatedInspiration = await updateInspiration(
        currentInspiration.id,
        {
          screenshot_uri: websiteURI,
          websiteMetadata: websiteMetadata,
        }
      )
      setInspirations((inspirations) =>
        inspirations.map((inspiration) => {
          if (inspiration.id === currentInspiration.id) {
            return updatedInspiration
          }
          return inspiration
        })
      )
      setCurrentInspiration(undefined)
    } else {
      const newInspiration: Inspiration = await createInspiration({
        projectId: project.id,
        screenshot_uri: websiteURI,
        websiteMetadata: websiteMetadata,
        notes: '',
      })
      setInspirations((inspirations) => [...inspirations, newInspiration])
    }
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
        <div>
          <span className={styles.label}>Inspirations</span>
          <InspirationView
            inspirations={inspirations}
            onAddEditInspiration={onAddEditInspiration}
            onDeleteInspiration={onDeleteInspiration}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            className={styles.addButton}
            onClick={() => onAddEditInspiration()}
          >
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
