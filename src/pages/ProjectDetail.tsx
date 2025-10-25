import { useState, useEffect, ChangeEvent } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../services/project'
import Button from '../components/Button'
import styles from './ProjectDetail.module.css'

import { deleteProject } from '../services/project'
import { Field, Input, Label, Textarea } from '@headlessui/react'
import { Project } from '../models/schema'

const ProjectDetail = () => {
  const [project, setProject] = useState<Project>()
  const [isEditing, setIsEditing] = useState(false)
  const { id } = useParams<string>()
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')

  useEffect(() => {
    if (!id) return
    const fetchProject = async () => {
      const projectData = await getProject(id)
      setProject(projectData)
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
    setName(e.target.value)
  }

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = () => {
    console.log('save')
  }

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.editForm}>
          <Field className={styles.field}>
            <Label className={styles.label}>Project Name</Label>
            <Input
              value={name}
              onChange={onNameChange}
              className={styles.input}
            />
          </Field>
          <Field className={styles.field}>
            <Label className={styles.label}>Project Description</Label>
            <Textarea
              value={description}
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
        <h2 className={styles.subheading}>Inspirations</h2>
        {project.inspirations?.length > 0 ? (
          <ul className={styles.inspirationList}>
            {project.inspirations.map((inspiration) => (
              <li key={inspiration.id}>
                {inspiration.websiteMetadata.title ||
                  inspiration.websiteMetadata.url}
              </li>
            ))}
          </ul>
        ) : (
          <p>No inspirations added yet.</p>
        )}
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
  )
}

export default ProjectDetail
