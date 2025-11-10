import { useState, useEffect, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { getProject, updateProject } from '../services/project'
import Button from '../components/Button'
import styles from './ProjectDetail.module.css'

import { deleteProject } from '../services/project'
import { Field, Input, Label, Textarea } from '@headlessui/react'
import { Project } from '../models/schema'
import { InspirationGrid } from '../components/InspirationGrid'
import { InspirationDialog } from '../components/InspirationDialog'
import { getMetadata, getScreenshot } from '../utils/api'
import { createInspiration, deleteInspiration } from '../services/inspiration'

const ProjectDetail = () => {
  const [project, setProject] = useState<Project>({} as Project)
  const [isEditing, setIsEditing] = useState(false)
  const { id } = useParams<string>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  if (!id) return <></>

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      const projectData = await getProject(id)
      if (projectData) {
        console.log(projectData)
        setProject(projectData)
      }
    }
    fetchProject()
  }, [id])

  if (!project) {
    return <div>Loading...</div>
  }

  const handleEditProject = () => {
    setIsEditing(true)
  }

  const handleDeleteProject = async (id?: string) => {
    if (!id) return
    await deleteProject(id)
  }
  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProject((prev) => ({
      ...prev,
      name: e.target.value,
    }))
  }

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setProject((prev) => ({
      ...prev,
      description: e.target.value,
    }))
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    await updateProject(id, project)
    setIsEditing(false)
  }

  const closeDialog = () => {
    setIsOpen(false)
  }

  const onSaveInspiration = async (data: {
    url: string
    date: string
    notes: string
  }) => {
    if (!id) return
    const { url, date, notes } = data
    const screenShotURI: string = await getScreenshot(url, date)
    const websiteMetadata: any = await getMetadata(url, date)

    const newInspiration = await createInspiration({
      projectId: id,
      websiteMetadata,
      screenshot_uri: screenShotURI,
      notes,
    })

    await updateProject(id, {
      inspirations: [...project.inspirations, newInspiration],
    })
    await refreshProject()
  }

  const refreshProject = async () => {
    const updatedProject = await getProject(id)
    if (updatedProject) {
      setProject(updatedProject)
    }
  }

  const handleDeleteInspiration = async (inspirationId: string) => {
    await deleteInspiration(inspirationId)
    await updateProject(id, {
      inspirations: project.inspirations.filter(
        (inspiration) => inspiration.id !== inspirationId
      ),
    })
    await refreshProject()
  }

  return (
    <>
      <div className={styles.container}>
        {isEditing ? (
          <div className={styles.editForm}>
            <Field className={styles.field}>
              <Label className={styles.label}>Project Name</Label>
              <Input
                value={project.name ?? ''}
                onChange={onNameChange}
                className={styles.input}
              />
            </Field>
            <Field className={styles.field}>
              <Label className={styles.label}>Project Description</Label>
              <Textarea
                value={project.description ?? ''}
                onChange={onDescriptionChange}
                className={styles.textarea}
              />
            </Field>
            <div className={styles.formButtons}>
              <Button onClick={handleSave} className={styles.editButton}>
                Save
              </Button>
              <Button onClick={handleCancel} className={styles.deleteButton}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className={styles.heading}>{project.name}</h1>
            <p className={styles.description}>{project.description}</p>
          </>
        )}
        <div className={styles.section}>
          <h2 className={styles.subheading}>Project Details</h2>
          <p>
            <strong>Created:</strong>
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Updated:</strong>
            {new Date(project.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className={styles.section}>
          <div className="flex justify-between items-center mb-2">
            <h2 className={styles.subheading}>Inspirations</h2>
            <Button onClick={() => setIsOpen(true)}>Add Inspirations</Button>
          </div>
          <InspirationGrid
            inspirations={project.inspirations}
            refreshProject={refreshProject}
            onDeleteInspiration={handleDeleteInspiration}
          />
        </div>
        {!isEditing && (
          <div className={styles.buttonContainer}>
            <Button className={styles.editButton} onClick={handleEditProject}>
              Edit Project
            </Button>
            <Button
              className={styles.deleteButton}
              onClick={() => handleDeleteProject(id)}
            >
              Delete Project
            </Button>
          </div>
        )}
      </div>
      <InspirationDialog
        isOpen={isOpen}
        closeDialog={closeDialog}
        onSaveInspiration={onSaveInspiration}
      />
    </>
  )
}

export default ProjectDetail
