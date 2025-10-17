import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, deleteProject, updateProject } from '../services/project'
import { Project } from '../models/schema'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import usePageTitle from '../hooks/usePageTitle'
import styles from './ProjectDetail.module.css'
import { Input } from '@headlessui/react'

const ProjectDetail: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  usePageTitle(project?.name || 'Project Detail')

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Project ID is missing')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const projectData = await getProject(id)
        if (!projectData) {
          setError('Project not found')
        } else {
          setProject(projectData)
          setEditedName(projectData.name)
          setEditedDescription(projectData.description)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleEditProject = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (project) {
      setEditedName(project.name)
      setEditedDescription(project.description)
    }
    setIsEditing(false)
  }

  const handleSaveProject = async () => {
    if (!id || !project) return

    try {
      setIsSaving(true)
      setError(null)
      const updatedProject = await updateProject(id, {
        name: editedName,
        description: editedDescription,
      })
      setProject(updatedProject)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!id) return

    const confirmed = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone.'
    )
    if (!confirmed) return

    try {
      setIsDeleting(true)
      setError(null)
      await deleteProject(id)
      navigate('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading project..." />
  }

  if (error && !project) {
    return <ErrorMessage message={error} />
  }

  if (!project) {
    return <ErrorMessage message="Project not found" />
  }

  return (
    <div className={styles.container}>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {isEditing ? (
        <div className="mb-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Name
            </label>
            <Input
              id="name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveProject} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handleCancelEdit} disabled={isSaving}>
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
          <strong>Created:</strong>{' '}
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Updated:</strong>{' '}
          {new Date(project.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>Inspirations</h2>
        {project.inspirations?.length > 0 ? (
          <ul className={styles.inspirationList}>
            {project.inspirations.map((inspiration) => (
              <li key={inspiration.id}>
                {inspiration.websiteMetadata?.title ||
                  inspiration.websiteMetadata?.url ||
                  'Untitled'}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No inspirations added yet.</p>
        )}
      </div>

      {!isEditing && (
        <div className={styles.buttonContainer}>
          <Button className={styles.editButton} onClick={handleEditProject}>
            Edit Project
          </Button>
          <Button
            className={styles.deleteButton}
            onClick={handleDeleteProject}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
