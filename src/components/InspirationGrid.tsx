import React from 'react'
import { Inspiration } from '../models/schema'
import InspirationCard from './InspirationCard'

interface InspirationGridProps {
  inspirations: Inspiration[]
  isLoading: boolean
  onView: (inspiration: Inspiration) => void
  onDelete: (id: string) => void
}

const InspirationGrid: React.FC<InspirationGridProps> = ({
  inspirations,
  isLoading,
  onView,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-64 animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  if (inspirations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No inspirations yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first inspiration.
        </p>
      </div>
    )
  }
  console.log('Rendering InspirationGrid with inspirations:', inspirations)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inspirations.map((inspiration) => (
        <InspirationCard
          key={inspiration.id}
          inspiration={inspiration}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default InspirationGrid
