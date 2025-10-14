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
import { Project } from '../../models/schema'
import { getInspiration } from '../../services/inspiration'

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
  const [inspirations, setInspirations] = useState(project.inspirations)

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

  const handleSaveInspiration = async (newInspirationIds: string[]) => {
    const adds: string[] = []
    const removes: string[] = []

    for (const id of newInspirationIds)
      if (!inspirations.map((inspiration) => inspiration.id).includes(id))
        adds.push(id)
    for (const { id } of inspirations)
      if (!newInspirationIds.includes(id)) removes.push(id)

    if (adds.length === 0 && removes.length === 0) return

    const filteredInspirations = inspirations.filter(
      (inspiration) => !removes.includes(inspiration.id)
    )
    if (adds.length === 0) {
      setInspirations(filteredInspirations)
    } else {
      const newInspirations = await Promise.all(
        adds.map((id) => getInspiration(id))
      )
      setInspirations([
        ...filteredInspirations,
        ...newInspirations.filter((x) => x !== undefined),
      ])
    }
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
        <div className={styles.buttonContainer}>
          <Button
            className={styles.addButton}
            onClick={() => onAddInspiration()}
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
            <div>Select inspirations</div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}
