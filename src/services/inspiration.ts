import { v4 as uuidv4 } from 'uuid'
import { getDB } from '../utils/indexedDB'
import { Inspiration } from '../models/schema'
import mockLatency from '../utils/mockLatency'

export interface InspirationMutationResult {
  inspiration: Inspiration
  inspirations: Inspiration[]
}

export interface InspirationDeletionResult {
  deletedId: string
  inspirations: Inspiration[]
}

type CreateInspirationInput = Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt'>

type UpdateInspirationInput = Partial<Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Creates a new inspiration entry in the database.
 * @param inspiration - The inspiration object without id, createdAt, and updatedAt fields.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to both the new inspiration and the latest list for the project.
 */
export async function createInspiration(
  inspiration: CreateInspirationInput,
  latencyMs?: number
): Promise<InspirationMutationResult> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const now = new Date().toISOString()
  const newInspiration: Inspiration = {
    ...inspiration,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }
  await db.add('inspirations', newInspiration)
  const inspirations = await getInspirationsByProject(newInspiration.projectId)
  return { inspiration: newInspiration, inspirations }
}

/**
 * Retrieves an inspiration entry from the database by its ID.
 * @param id - The unique identifier of the inspiration.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the Inspiration object if found, or undefined if not found.
 */
export async function getInspiration(
  id: string,
  latencyMs?: number
): Promise<Inspiration | undefined> {
  await mockLatency(latencyMs)
  const db = await getDB()
  return db.get('inspirations', id)
}

/**
 * Retrieves all inspiration entries associated with a specific project.
 * @param projectId - The unique identifier of the project.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to an array of Inspiration objects.
 */
export async function getInspirationsByProject(
  projectId: string,
  latencyMs?: number
): Promise<Inspiration[]> {
  await mockLatency(latencyMs)
  const db = await getDB()
  return db.getAllFromIndex('inspirations', 'by-project', projectId)
}

/**
 * Updates an existing inspiration entry in the database.
 * @param id - The unique identifier of the inspiration to update.
 * @param updates - An object containing the fields to update.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the updated inspiration and the current list for the project.
 * @throws Error if the inspiration is not found.
 */
export async function updateInspiration(
  id: string,
  updates: UpdateInspirationInput,
  latencyMs?: number
): Promise<InspirationMutationResult> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const inspiration = await db.get('inspirations', id)
  if (!inspiration) {
    throw new Error('Inspiration not found')
  }
  const projectId = updates.projectId ?? inspiration.projectId
  const updatedInspiration: Inspiration = {
    ...inspiration,
    ...updates,
    projectId,
    updatedAt: new Date().toISOString(),
  }
  await db.put('inspirations', updatedInspiration)
  const inspirations = await getInspirationsByProject(projectId)
  return { inspiration: updatedInspiration, inspirations }
}

/**
 * Deletes an inspiration entry from the database.
 * @param id - The unique identifier of the inspiration to delete.
 * @param latencyMs - Optional. The number of milliseconds to simulate latency.
 * @returns A Promise that resolves to the deleted id and the refreshed project inspirations.
 */
export async function deleteInspiration(
  id: string,
  latencyMs?: number
): Promise<InspirationDeletionResult> {
  await mockLatency(latencyMs)
  const db = await getDB()
  const inspiration = await db.get('inspirations', id)
  if (!inspiration) {
    throw new Error('Inspiration not found')
  }
  await db.delete('inspirations', id)
  const inspirations = await getInspirationsByProject(inspiration.projectId)
  return { deletedId: id, inspirations }
}
