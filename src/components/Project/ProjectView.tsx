import { Button } from '@headlessui/react'
import { Project } from '../../models/schema'
import styles from './ProjectView.module.css'

interface ProjectDetailProps {
  project: Project
  handleEditProject: () => void
  handleDeleteProject: (id: string) => void
  id: string
}

export const ProjectView = ({
  project,
  handleEditProject,
  handleDeleteProject,
  id,
}: ProjectDetailProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{project.name}</h1>
      <p className={styles.description}>{project.description}</p>
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
    </div>
  )
}
