import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject, updateProject } from '../services/project'

import { deleteProject } from '../services/project'
import { ProjectView } from '../components/Project/ProjectView'
import { ProjectForm } from '../components/Project/ProjectForm'
import { Project } from '../models/schema'

const ProjectDetail = () => {
  const [project, setProject] = useState<Project | undefined>()
  const [isEditing, setIsEditing] = useState(false)
  const { id } = useParams<string>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
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

  const handleSaveProject = async (updates: Partial<Project>) => {
    if (!id) return
    const res = await updateProject(id, updates, 100)
    console.log(res)
  }

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id)
    navigate('/projects')
  }

  return isEditing ? (
    <ProjectForm project={project} onSaveFormChange={handleSaveProject} />
  ) : (
    id && (
      <ProjectView
        handleEditProject={handleEditProject}
        handleDeleteProject={handleDeleteProject}
        id={id}
        project={project}
      />
    )
  )
}

export default ProjectDetail
