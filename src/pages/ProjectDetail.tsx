import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, deleteProject, updateProject } from '../services/project'
import {
  getInspirationsByProject,
  createInspiration,
  deleteInspiration,
} from '../services/inspiration'
import { getScreenshot, getMetadata } from '../utils/api'
import { Project, Inspiration } from '../models/schema'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import InspirationGrid from '../components/InspirationGrid'
import AddInspirationModal from '../components/AddInspirationModal'
import InspirationDetailModal from '../components/InspirationDetailModal'
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

  // Inspiration state
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const [isLoadingInspirations, setIsLoadingInspirations] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedInspiration, setSelectedInspiration] =
    useState<Inspiration | null>(null)

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  usePageTitle(project?.name || 'Project Detail')

  // Fetch project and inspirations
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Project ID is missing')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Fetch project
        const projectData = await getProject(id)
        if (!projectData) {
          setError('Project not found')
          return
        }
        setProject(projectData)
        setEditedName(projectData.name)
        setEditedDescription(projectData.description)

        // Fetch inspirations
        setIsLoadingInspirations(true)
        const inspirationsData = await getInspirationsByProject(id)
        setInspirations(inspirationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
        setIsLoadingInspirations(false)
      }
    }

    fetchData()
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

  // Inspiration handlers
  const handleAddInspiration = async (data: {
    url: string
    notes: string
    date?: string
  }) => {
    if (!id) return

    try {
      // Fetch screenshot and metadata
      const screenshotUri = await getScreenshot(data.url, data.date || null)
      const metadata = await getMetadata(data.url, data.date || null)

      // Create inspiration
      const newInspiration = await createInspiration({
        projectId: id,
        websiteMetadata: metadata,
        screenshot_uri: screenshotUri,
        notes: data.notes,
      })

      // Update local state
      setInspirations([...inspirations, newInspiration])

      // Update project's inspirations array
      if (project) {
        const updatedProject = await updateProject(id, {
          inspirations: [...inspirations, newInspiration],
        })
        setProject(updatedProject)
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : 'Failed to add inspiration'
      )
    }
  }

  const handleViewInspiration = (inspiration: Inspiration) => {
    setSelectedInspiration(inspiration)
    setShowDetailModal(true)
  }

  const handleDeleteInspiration = async (inspirationId: string) => {
    if (!id) return

    try {
      await deleteInspiration(inspirationId)

      // Update local state
      const updatedInspirations = inspirations.filter(
        (i) => i.id !== inspirationId
      )
      setInspirations(updatedInspirations)

      // Update project's inspirations array
      if (project) {
        const updatedProject = await updateProject(id, {
          inspirations: updatedInspirations,
        })
        setProject(updatedProject)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete inspiration'
      )
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

      {/* Inspirations Section */}
      <div className={styles.section}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={styles.subheading}>
            Inspirations ({inspirations.length})
          </h2>
          <Button onClick={() => setShowAddModal(true)}>
            + Add Inspiration
          </Button>
        </div>

        <InspirationGrid
          inspirations={inspirations}
          isLoading={isLoadingInspirations}
          onView={handleViewInspiration}
          onDelete={handleDeleteInspiration}
        />
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

      {/* Modals */}
      <AddInspirationModal
        projectId={id || ''}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddInspiration}
      />

      <InspirationDetailModal
        inspiration={selectedInspiration}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedInspiration(null)
        }}
      />
    </div>
  )
}

export default ProjectDetail
