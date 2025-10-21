import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Inspiration } from '../models/schema'
import {
  createInspiration,
  deleteInspiration,
  getInspirationsByProject,
  updateInspiration,
} from '../services/inspiration'

type NullableString = string | null | undefined

interface BaseActionOptions {
  latencyMs?: number
}

type CreateInput = Parameters<typeof createInspiration>[0]
type UpdateInput = Parameters<typeof updateInspiration>[1]

interface UseInspirationsResult {
  inspirations: Inspiration[]
  isLoading: boolean
  isMutating: boolean
  error: Error | null
  refresh: (options?: BaseActionOptions) => Promise<void>
  create: (
    payload: CreateInput,
    options?: BaseActionOptions
  ) => Promise<Inspiration>
  update: (
    inspirationId: string,
    payload: UpdateInput,
    options?: BaseActionOptions
  ) => Promise<Inspiration>
  remove: (inspirationId: string, options?: BaseActionOptions) => Promise<void>
}

const useInspirations = (projectId: NullableString): UseInspirationsResult => {
  const [inspirations, setInspirations] = useState<Inspiration[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isMutating, setIsMutating] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const loadInspirations = useCallback(
    async (options?: BaseActionOptions) => {
      if (!projectId) {
        setInspirations([])
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const data = await getInspirationsByProject(projectId, options?.latencyMs)
        setInspirations(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    },
    [projectId]
  )

  useEffect(() => {
    void loadInspirations()
  }, [loadInspirations])

  const handleCreate = useCallback(
    async (payload: CreateInput, options?: BaseActionOptions) => {
      if (!payload.projectId) {
        throw new Error('projectId is required to create an inspiration')
      }

      const optimisticInspiration: Inspiration = {
        ...payload,
        id: `tmp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setError(null)
      setIsMutating(true)
      setInspirations((prev) => [...prev, optimisticInspiration])

      try {
        const { inspiration, inspirations: latest } = await createInspiration(
          payload,
          options?.latencyMs
        )
        setInspirations(latest)
        return inspiration
      } catch (err) {
        setError(err as Error)
        setInspirations((prev) =>
          prev.filter((inspiration) => inspiration.id !== optimisticInspiration.id)
        )
        throw err
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  const handleUpdate = useCallback(
    async (inspirationId: string, payload: UpdateInput, options?: BaseActionOptions) => {
      if (!inspirationId) {
        throw new Error('inspirationId is required to update an inspiration')
      }

      setError(null)
      setIsMutating(true)

      let previous: Inspiration[] = []
      setInspirations((prev) => {
        previous = prev
        return prev.map((inspiration) =>
          inspiration.id === inspirationId
            ? { ...inspiration, ...payload, updatedAt: new Date().toISOString() }
            : inspiration
        )
      })

      try {
        const { inspiration, inspirations: latest } = await updateInspiration(
          inspirationId,
          payload,
          options?.latencyMs
        )
        setInspirations(latest)
        return inspiration
      } catch (err) {
        setError(err as Error)
        setInspirations(previous)
        throw err
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  const handleDelete = useCallback(
    async (inspirationId: string, options?: BaseActionOptions) => {
      if (!inspirationId) {
        throw new Error('inspirationId is required to delete an inspiration')
      }

      setError(null)
      setIsMutating(true)

      let previous: Inspiration[] = []
      setInspirations((prev) => {
        previous = prev
        return prev.filter((inspiration) => inspiration.id !== inspirationId)
      })

      try {
        const { inspirations: latest } = await deleteInspiration(
          inspirationId,
          options?.latencyMs
        )
        setInspirations(latest)
      } catch (err) {
        setError(err as Error)
        setInspirations(previous)
        throw err
      } finally {
        setIsMutating(false)
      }
    },
    []
  )

  return useMemo(
    () => ({
      inspirations,
      isLoading,
      isMutating,
      error,
      refresh: loadInspirations,
      create: handleCreate,
      update: handleUpdate,
      remove: handleDelete,
    }),
    [error, handleCreate, handleDelete, handleUpdate, inspirations, isLoading, isMutating, loadInspirations]
  )
}

export default useInspirations
