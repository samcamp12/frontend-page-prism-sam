import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../utils/indexedDB'
import { Project } from '../models/schema'
import mockLatency from '../utils/mockLatency'
import { getInspirationsByProject } from './inspiration'

type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'inspirations'> & {
  inspirations?: Project['inspirations']
}

type UpdateProjectInput = Partial<
  Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'inspirations'>
>

async function hydrateProject(project: Project): Promise<Project> {
  const inspirations = await getInspirationsByProject(project.id)
  return {
    ...project,
    inspirations,
  }
}

/**
 * Creates a new project in the database.
 * @param project - The project object to create (without id, createdAt, and updatedAt).
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the newly created Project.
 */
export async function createProject(
  project: CreateProjectInput,
  latencyMs?: number
): Promise<Project> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const newProject: Project = {
    ...project,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inspirations: project.inspirations ?? [],
  }
  await db.add('projects', newProject)
  return newProject
}

/**
 * Retrieves a project from the database by its ID.
 * @param id - The ID of the project to retrieve.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the Project if found, or undefined if not found.
 */
export async function getProject(
  id: string,
  latencyMs?: number
): Promise<Project | undefined> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const project = await db.get('projects', id)
  if (!project) {
    return undefined
  }
  return hydrateProject(project)
}

/**
 * Retrieves all projects from the database.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to an array of all Projects.
 */
export async function getAllProjects(latencyMs?: number): Promise<Project[]> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const projects = await db.getAll('projects')
  return Promise.all(projects.map((project) => hydrateProject(project)))
}

/**
 * Updates an existing project in the database.
 * @param id - The ID of the project to update.
 * @param updates - Partial Project object containing the fields to update.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the updated Project.
 * @throws Error if the project is not found.
 */
export async function updateProject(
  id: string,
  updates: UpdateProjectInput,
  latencyMs?: number
): Promise<Project> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const project = await db.get('projects', id)
  if (!project) {
    throw new Error('Project not found')
  }
  const updatedProject: Project = {
    ...project,
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  await db.put('projects', updatedProject)
  return hydrateProject(updatedProject)
}

/**
 * Deletes a project from the database.
 * @param id - The ID of the project to delete.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves when the project is deleted.
 */
export async function deleteProject(
  id: string,
  latencyMs?: number
): Promise<void> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const inspirations = await getInspirationsByProject(id, 0)
  await Promise.all(
    inspirations.map((inspiration) => db.delete('inspirations', inspiration.id))
  )
  await db.delete('projects', id)
}
