import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useToast } from '../components/ToastProvider'
import { createProject, getAllProjects } from '../services/project'
import styles from './Projects.module.css'

const formatDate = (iso) => {
  if (!iso) {
    return ''
  }
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const allProjects = await getAllProjects()
        setProjects(allProjects)
      } catch (err) {
        setError(err)
        toast.push({
          title: 'Unable to load projects',
          description: err.message || 'Please refresh and try again.',
          variant: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [toast])

  const handleCreateProject = async () => {
    const name = window.prompt('Name your project')
    if (!name) {
      return
    }
    const description = window.prompt('Add a short description', '') || ''

    setIsCreating(true)
    setError(null)

    try {
      const newProject = await createProject({
        name: name.trim(),
        description: description.trim(),
        inspirations: [],
      })
      setProjects((previous) => [...previous, newProject])
      toast.push({
        title: 'Project created',
        description: 'Start saving inspirations to this space.',
        variant: 'success',
      })
      navigate(`/projects/${newProject.id}`)
    } catch (err) {
      setError(err)
      toast.push({
        title: 'Unable to create project',
        description: err.message || 'Please try again.',
        variant: 'error',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      ),
    [projects]
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Projects</h1>
          <p className={styles.subheading}>
            Curate collections of inspirations for every product, campaign, or concept.
          </p>
        </div>
        <Button onClick={handleCreateProject} disabled={isCreating} className={styles.createButton}>
          {isCreating ? 'Creating…' : 'New project'}
        </Button>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          {error.message || 'Something went wrong. Please try again.'}
        </div>
      )}

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonLineWide} />
              <div className={styles.skeletonLineNarrow} />
              <div className={styles.skeletonFooter}>
                <span className={styles.skeletonBadge} />
                <span className={styles.skeletonBadge} />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProjects.length ? (
        <div className={styles.grid}>
          {sortedProjects.map((project) => {
            const inspirationCount = project.inspirations?.length || 0

            return (
              <article
                key={project.id}
                className={styles.card}
                onClick={() => navigate(`/projects/${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    navigate(`/projects/${project.id}`)
                  }
                }}
              >
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{project.name}</h2>
                  <p className={styles.cardDescription}>{project.description || 'No description yet.'}</p>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.badge}>
                    {inspirationCount}{' '}
                    {inspirationCount === 1 ? 'inspiration' : 'inspirations'}
                  </span>
                  <span className={styles.timestamp}>
                    Updated {formatDate(project.updatedAt || project.createdAt)}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>You have no projects yet</h2>
          <p className={styles.emptyCopy}>
            Spin up your first project to start capturing the web experiences that inspire you.
          </p>
          <Button onClick={handleCreateProject} disabled={isCreating}>
            {isCreating ? 'Creating…' : 'Create your first project'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default Projects

