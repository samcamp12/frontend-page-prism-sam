import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import InspirationDialog from '../components/InspirationDialog'
import InspirationList from '../components/InspirationList'
import { useToast } from '../components/ToastProvider'
import useInspirations from '../hooks/useInspirations'
import { deleteProject, getProject } from '../services/project'
import { getMetadata, getScreenshot } from '../utils/api'
import styles from './ProjectDetail.module.css'

const createDefaultMetadata = (url) => ({
  url,
  title: null,
  description: null,
  favicon: null,
  author: null,
  date: null,
  image: null,
  logo: null,
  publisher: null,
  ogTitle: null,
  ogDescription: null,
  ogImage: [],
  ogLocale: null,
  ogUrl: null,
  charset: null,
  urlRequested: url,
  urlResolved: url,
})

const normalizeMetadata = (rawMetadata, fallbackUrl) => {
  const baseUrl = rawMetadata?.url || fallbackUrl || ''
  const base = createDefaultMetadata(baseUrl)

  if (!rawMetadata) {
    return base
  }

  const normalizedOgImage = Array.isArray(rawMetadata.ogImage)
    ? rawMetadata.ogImage
    : rawMetadata.ogImage
    ? [rawMetadata.ogImage]
    : []

  return {
    ...base,
    ...rawMetadata,
    url: rawMetadata.url ?? baseUrl,
    urlRequested: rawMetadata.urlRequested ?? base.urlRequested,
    urlResolved: rawMetadata.urlResolved ?? rawMetadata.url ?? base.urlResolved,
    ogImage: normalizedOgImage,
  }
}

const convertObjectUrlToDataUrl = async (objectUrl) => {
  const response = await fetch(objectUrl)
  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result || '')
    reader.onerror = () => reject(new Error('Failed to prepare screenshot.'))
    reader.readAsDataURL(blob)
  })
}

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [project, setProject] = useState(null)
  const [projectError, setProjectError] = useState(null)
  const [isProjectLoading, setIsProjectLoading] = useState(true)

  const {
    inspirations,
    isLoading: isInspirationsLoading,
    isMutating: isInspirationsMutating,
    error: inspirationsError,
    create,
    update,
    remove,
  } = useInspirations(id)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState('create')
  const [activeInspiration, setActiveInspiration] = useState(null)
  const [dialogInitialValues, setDialogInitialValues] = useState({
    url: '',
    notes: '',
  })
  const [previewMetadata, setPreviewMetadata] = useState(null)
  const [previewScreenshot, setPreviewScreenshot] = useState(null)
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)
  const [formError, setFormError] = useState(null)
  const lastDeletedInspiration = useRef(null)

  useEffect(() => {
    let isMounted = true

    const fetchProject = async () => {
      setIsProjectLoading(true)
      setProjectError(null)

      try {
        const projectData = await getProject(id)
        if (isMounted) {
          setProject(projectData ?? null)
        }
      } catch (error) {
        if (isMounted) {
          setProjectError(error)
        }
      } finally {
        if (isMounted) {
          setIsProjectLoading(false)
        }
      }
    }

    if (id) {
      fetchProject()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    return () => {
      if (previewScreenshot && previewScreenshot.startsWith('blob:')) {
        URL.revokeObjectURL(previewScreenshot)
      }
    }
  }, [previewScreenshot])

  const isLoading = isProjectLoading || (!project && !projectError)
  const totalInspirations = inspirations.length

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    setDialogMode('create')
    setActiveInspiration(null)
    setDialogInitialValues({ url: '', notes: '' })
    setFormError(null)
    setPreviewMetadata(null)
    setPreviewScreenshot((current) => {
      if (current && current.startsWith('blob:')) {
        URL.revokeObjectURL(current)
      }
      return null
    })
  }, [])

  const handleAddInspiration = useCallback(() => {
    setDialogMode('create')
    setActiveInspiration(null)
    setDialogInitialValues({ url: '', notes: '' })
    setFormError(null)
    setPreviewMetadata(null)
    setPreviewScreenshot((current) => {
      if (current && current.startsWith('blob:')) {
        URL.revokeObjectURL(current)
      }
      return null
    })
    setIsDialogOpen(true)
  }, [])

  const handleEditInspiration = useCallback((inspiration) => {
    if (!inspiration) {
      return
    }

    setDialogMode('edit')
    setActiveInspiration(inspiration)
    setDialogInitialValues({
      url: inspiration.websiteMetadata?.url || '',
      notes: inspiration.notes || '',
    })
    setFormError(null)
    setPreviewMetadata(inspiration.websiteMetadata || null)
    setPreviewScreenshot((current) => {
      if (current && current.startsWith('blob:')) {
        URL.revokeObjectURL(current)
      }
      return inspiration.screenshot_uri || null
    })
    setIsDialogOpen(true)
  }, [])

  const handleFetchPreview = useCallback(
    async (url) => {
      const trimmedUrl = url?.trim()
      if (!trimmedUrl) {
        return
      }

      setFormError(null)
      setIsFetchingPreview(true)
      setPreviewMetadata(null)
      setPreviewScreenshot((current) => {
        if (current && current.startsWith('blob:')) {
          URL.revokeObjectURL(current)
        }
        return null
      })

      try {
        const metadataResponse = await getMetadata(trimmedUrl)
        const normalizedMetadata = normalizeMetadata(metadataResponse, trimmedUrl)
        setPreviewMetadata(normalizedMetadata)

        try {
          const screenshotUri = await getScreenshot(trimmedUrl, null, { w: 1200 })
          setPreviewScreenshot(screenshotUri)
        } catch (screenshotError) {
          setPreviewScreenshot(null)
        }
      } catch (error) {
        setFormError(
          'We could not load a preview for that URL. You can still save this inspiration.'
        )
        setPreviewMetadata(normalizeMetadata(null, trimmedUrl))
      } finally {
        setIsFetchingPreview(false)
      }
    },
    []
  )

  const prepareScreenshotForStorage = useCallback(async (candidate, fallback) => {
    if (candidate && candidate.startsWith('blob:')) {
      try {
        return await convertObjectUrlToDataUrl(candidate)
      } catch (error) {
        return fallback || ''
      }
    }

    if (candidate) {
      return candidate
    }

    return fallback || ''
  }, [])

  const handleSubmitInspiration = useCallback(
    async ({ url, notes }) => {
      const trimmedUrl = url.trim()
      const trimmedNotes = notes.trim()
      setFormError(null)

      let metadataToPersist = previewMetadata
      let screenshotToPersist = previewScreenshot

      if (!metadataToPersist || !metadataToPersist.url) {
        try {
          const metadataResponse = await getMetadata(trimmedUrl)
          metadataToPersist = normalizeMetadata(metadataResponse, trimmedUrl)
        } catch (error) {
          metadataToPersist = normalizeMetadata(null, trimmedUrl)
        }
      } else {
        metadataToPersist = normalizeMetadata(metadataToPersist, trimmedUrl)
      }

      if (!screenshotToPersist && dialogMode === 'edit' && activeInspiration) {
        screenshotToPersist = activeInspiration.screenshot_uri || ''
      }

      const screenshotForStorage = await prepareScreenshotForStorage(
        screenshotToPersist,
        activeInspiration?.screenshot_uri || ''
      )

      try {
        if (dialogMode === 'edit' && activeInspiration) {
          await update(activeInspiration.id, {
            notes: trimmedNotes,
            websiteMetadata: metadataToPersist,
            screenshot_uri: screenshotForStorage,
          })
          toast.push({
            title: 'Inspiration updated',
            description: 'Your changes were saved to this project.',
            variant: 'success',
          })
        } else {
          await create({
            projectId: id,
            notes: trimmedNotes,
            websiteMetadata: metadataToPersist,
            screenshot_uri: screenshotForStorage,
          })
          toast.push({
            title: 'Inspiration saved',
            description: 'We added it to this project.',
            variant: 'success',
          })
        }

        setProject((previous) =>
          previous
            ? {
                ...previous,
                updatedAt: new Date().toISOString(),
              }
            : previous
        )

        handleCloseDialog()
      } catch (error) {
        setFormError(error.message || 'Unable to save inspiration right now.')
        toast.push({
          title: 'Something went wrong',
          description: error.message || 'Please try again.',
          variant: 'error',
        })
        throw error
      }
    },
    [
      activeInspiration,
      create,
      dialogMode,
      handleCloseDialog,
      id,
      prepareScreenshotForStorage,
      previewMetadata,
      previewScreenshot,
      update,
      toast,
    ]
  )

  const handleDeleteInspiration = useCallback(
    async (inspiration) => {
      if (!inspiration) {
        return
      }

      setProjectError(null)

      try {
        lastDeletedInspiration.current =
          typeof structuredClone === 'function'
            ? structuredClone(inspiration)
            : JSON.parse(JSON.stringify(inspiration))
      } catch (error) {
        lastDeletedInspiration.current = inspiration
      }

      try {
        await remove(inspiration.id)
        toast.push({
          title: 'Inspiration archived',
          description: 'The entry was removed from this project.',
          action: {
            label: 'Undo',
            onClick: async () => {
              if (!lastDeletedInspiration.current) {
                return
              }
              const { projectId, notes, websiteMetadata, screenshot_uri } =
                lastDeletedInspiration.current
              try {
                await create({
                  projectId,
                  notes,
                  websiteMetadata,
                  screenshot_uri,
                })
                toast.push({
                  title: 'Inspiration restored',
                  description: 'The entry is back in the list.',
                  variant: 'success',
                })
              } catch (error) {
                toast.push({
                  title: 'Unable to restore inspiration',
                  description: error.message || 'Please try again.',
                  variant: 'error',
                })
              } finally {
                lastDeletedInspiration.current = null
              }
            },
          },
        })
      } catch (error) {
        setProjectError(error)
        toast.push({
          title: 'Failed to archive inspiration',
          description: error.message || 'Please try again.',
          variant: 'error',
        })
      }
    },
    [create, remove, toast]
  )

  const handleDeleteProject = useCallback(async () => {
    if (!id) {
      return
    }

    const confirmed = window.confirm(
      'Delete this project? All saved inspirations will be removed.'
    )
    if (!confirmed) {
      return
    }

    setProjectError(null)

    try {
      await deleteProject(id)
      navigate('/projects')
      toast.push({
        title: 'Project deleted',
        description: 'All associated inspirations were removed.',
        variant: 'success',
      })
    } catch (error) {
      setProjectError(error)
      toast.push({
        title: 'Unable to delete project',
        description: error.message || 'Please try again.',
        variant: 'error',
      })
    }
  }, [id, navigate, toast])

  const projectDetails = useMemo(() => {
    if (!project) {
      return null
    }

    return [
      {
        label: 'Created',
        value: new Date(project.createdAt).toLocaleString(undefined, {
          dateStyle: 'medium',
        }),
      },
      {
        label: 'Last updated',
        value: new Date(project.updatedAt || project.createdAt).toLocaleString(
          undefined,
          {
            dateStyle: 'medium',
            timeStyle: 'short',
          }
        ),
      },
      {
        label: 'Inspirations',
        value: `${totalInspirations}`,
      },
    ]
  }, [project, totalInspirations])

  if (isLoading) {
    return <div className={styles.loadingState}>Loading project…</div>
  }

  if (projectError && !project) {
    return (
      <div className={styles.errorState}>
        <h1 className={styles.errorTitle}>We could not load this project.</h1>
        <p className={styles.errorCopy}>
          {projectError.message || 'Please refresh and try again.'}
        </p>
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>{project.name}</h1>
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}
        </div>
        <div className={styles.headerActions}>
          <Button className={styles.secondaryButton} onClick={() => navigate('/projects')}>
            All projects
          </Button>
          <Button className={styles.primaryAction} onClick={handleAddInspiration}>
            Add inspiration
          </Button>
          <Button className={styles.deleteButton} onClick={handleDeleteProject}>
            Delete project
          </Button>
        </div>
      </header>

      {projectDetails && (
        <section className={styles.metaSection}>
          <ul className={styles.metaGrid}>
            {projectDetails.map((item) => (
              <li key={item.label} className={styles.metaItem}>
                <span className={styles.metaLabel}>{item.label}</span>
                <span className={styles.metaValue}>{item.value}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <h2 className={styles.subheading}>Inspirations</h2>
          <span className={styles.badge}>{totalInspirations}</span>
        </div>
        {inspirationsError && (
          <div className={styles.inlineError}>
            {inspirationsError.message || 'Unable to load inspirations.'}
          </div>
        )}
        <InspirationList
          inspirations={inspirations}
          isLoading={isInspirationsLoading}
          onEdit={handleEditInspiration}
          onDelete={handleDeleteInspiration}
        />
      </section>

      <InspirationDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        title={dialogMode === 'edit' ? 'Edit inspiration' : 'Add inspiration'}
        initialValues={dialogInitialValues}
        metadata={previewMetadata}
        screenshotUri={previewScreenshot}
        onSubmit={handleSubmitInspiration}
        onFetchMetadata={handleFetchPreview}
        isSubmitting={isInspirationsMutating}
        isFetchingMetadata={isFetchingPreview}
        error={formError}
      />
    </div>
  )
}

export default ProjectDetail

