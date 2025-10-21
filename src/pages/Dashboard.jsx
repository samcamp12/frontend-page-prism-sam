import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useToast } from '../components/ToastProvider'
import { getAllProjects } from '../services/project'
import styles from './Dashboard.module.css'

const formatDate = (iso) => {
  if (!iso) {
    return ''
  }

  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getAllProjects()
        setProjects(data)
      } catch (err) {
        setError(err)
        toast.push({
          title: 'Unable to load dashboard data',
          description: err.message || 'Please refresh to try again.',
          variant: 'error',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const totalProjects = projects.length
  const totalInspirations = useMemo(
    () =>
      projects.reduce(
        (sum, project) => sum + (Array.isArray(project.inspirations) ? project.inspirations.length : 0),
        0
      ),
    [projects]
  )

  const allInspirations = useMemo(
    () =>
      projects.flatMap((project) =>
        (project.inspirations || []).map((inspiration) => ({
          ...inspiration,
          projectName: project.name,
        }))
      ),
    [projects]
  )

  const mostActiveProject = useMemo(() => {
    if (!projects.length) {
      return null
    }
    return [...projects].sort(
      (a, b) => (b.inspirations?.length || 0) - (a.inspirations?.length || 0)
    )[0]
  }, [projects])

  const recentInspirations = useMemo(
    () =>
      [...allInspirations]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 3),
    [allInspirations]
  )

  const recentlyUpdatedProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 4),
    [projects]
  )

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Workspace overview</h1>
          <p className={styles.subheading}>
            Keep tabs on the projects you’re curating and the inspirations you’ve captured.
          </p>
        </div>
        <Button onClick={() => navigate('/projects')} className={styles.primaryAction}>
          View projects
        </Button>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          {error.message || 'Something went wrong while loading your data.'}
        </div>
      )}

      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Projects</p>
            <p className={styles.statValue}>{totalProjects}</p>
            <span className={styles.statHint}>Active boards you’re tracking</span>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Inspirations</p>
            <p className={styles.statValue}>{totalInspirations}</p>
            <span className={styles.statHint}>Screens and references saved</span>
          </article>
          <article className={styles.statCard}>
            <p className={styles.statLabel}>Most active project</p>
            <p className={styles.statValue}>
              {mostActiveProject ? mostActiveProject.name : '—'}
            </p>
            <span className={styles.statHint}>
              {mostActiveProject
                ? `${mostActiveProject.inspirations?.length || 0} inspirations captured`
                : 'Add inspirations to see more insights'}
            </span>
          </article>
        </div>
      </section>

      {isLoading ? (
        <div className={styles.loadingShell}>
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
        </div>
      ) : (
        <>
          <section className={styles.recentSection}>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Recently updated projects</h2>
              <span className={styles.sectionHint}>
                {recentlyUpdatedProjects.length
                  ? 'Fresh activity across your workspace'
                  : 'Create a project to get started'}
              </span>
            </div>
            {recentlyUpdatedProjects.length ? (
              <ul className={styles.projectList}>
                {recentlyUpdatedProjects.map((project) => (
                  <li key={project.id} className={styles.projectListItem}>
                    <div>
                      <button
                        type="button"
                        className={styles.projectLink}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {project.name}
                      </button>
                      <p className={styles.projectDescription}>
                        {project.description || 'No description yet.'}
                      </p>
                    </div>
                    <span className={styles.projectTimestamp}>
                      Updated {formatDate(project.updatedAt || project.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyRow}>
                <p>No activity yet. Capture inspirations to see your progress here.</p>
              </div>
            )}
          </section>

          <section className={styles.recentSection}>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Latest inspirations</h2>
              <span className={styles.sectionHint}>
                {recentInspirations.length
                  ? 'Highlights from across your projects'
                  : 'Save an inspiration to populate this feed'}
              </span>
            </div>
            {recentInspirations.length ? (
              <ul className={styles.inspirationList}>
                {recentInspirations.map((inspiration) => (
                  <li key={inspiration.id} className={styles.inspirationItem}>
                    <div className={styles.inspirationMeta}>
                      <p className={styles.inspirationTitle}>
                        {inspiration.websiteMetadata?.title ||
                          inspiration.websiteMetadata?.ogTitle ||
                          inspiration.websiteMetadata?.url ||
                          'Untitled inspiration'}
                      </p>
                      <span className={styles.inspirationProject}>
                        {inspiration.projectName}
                      </span>
                    </div>
                    <div className={styles.inspirationDetails}>
                      <p className={styles.inspirationNotes}>
                        {inspiration.notes || 'No notes added yet.'}
                      </p>
                      <span className={styles.inspirationTimestamp}>
                        Logged {formatDate(inspiration.updatedAt || inspiration.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyRow}>
                <p>No inspirations yet. Use “Add inspiration” from any project to begin.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default Dashboard
