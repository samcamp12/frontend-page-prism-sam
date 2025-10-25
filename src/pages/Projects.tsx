import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProjects, createProject } from '../services/project'
import Button from '../components/Button'
import { Project } from '../models/schema'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const allProjects = await getAllProjects()
      setProjects(allProjects)
    }
    fetchProjects()
  }, [])

  const handleCreateProject = async () => {
    const newProject = await createProject({
      name: 'New Project',
      description: 'A new project description',
      inspirations: [],
    })
    setProjects([...projects, newProject])
  }

  console.log('Rendering Projects component with projects:', projects)

  return (
    <div>
      <Button onClick={handleCreateProject}>Create New Project</Button>
      {projects.map((project) => (
        <div key={project.id} className="p-4 border-b border-gray-200">
          <Link to={`/projects/${project.id}`} className="block">
            <h2 className="text-blue-900 text-lg font-semibold">
              {project.name}
            </h2>
            <small>
              {'Updated: ' +
                new Date(project.updatedAt).toISOString().slice(0, 10)}
            </small>
            <p className="text-sm text-gray-600">{project.description}</p>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Projects
