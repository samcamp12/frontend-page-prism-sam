import React from 'react'
import { Inspiration } from '../models/schema'

interface InspirationCardProps {
  inspiration: Inspiration
  onView: (inspiration: Inspiration) => void
  onDelete: (id: string) => void
}

const InspirationCard: React.FC<InspirationCardProps> = ({
  inspiration,
  onView,
  onDelete,
}) => {
  const { websiteMetadata, screenshot_uri, notes } = inspiration
  const title = websiteMetadata?.title || websiteMetadata?.url || 'Untitled'

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Screenshot */}
      <div
        className="h-48 bg-gray-200 cursor-pointer overflow-hidden"
        onClick={() => onView(inspiration)}
      >
        (
        <img
          src={screenshot_uri}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        )
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-semibold text-gray-900 mb-2 truncate cursor-pointer hover:text-indigo-600"
          onClick={() => onView(inspiration)}
          title={title}
        >
          {title}
        </h3>

        {websiteMetadata?.url && (
          <a
            href={websiteMetadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-800 block mb-2 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {websiteMetadata.url}
          </a>
        )}

        {notes && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notes}</p>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{new Date(inspiration.createdAt).toLocaleDateString()}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (
                window.confirm(
                  'Are you sure you want to delete this inspiration?'
                )
              ) {
                onDelete(inspiration.id)
              }
            }}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default InspirationCard
