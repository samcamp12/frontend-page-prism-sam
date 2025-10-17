import React from 'react'
import { Inspiration } from '../models/schema'

interface InspirationDetailModalProps {
  inspiration: Inspiration | null
  isOpen: boolean
  onClose: () => void
}

const InspirationDetailModal: React.FC<InspirationDetailModalProps> = ({
  inspiration,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !inspiration) return null

  const { websiteMetadata, screenshot_uri, notes, createdAt } = inspiration
  const title = websiteMetadata?.title || 'Untitled'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {websiteMetadata?.url && (
              <a
                href={websiteMetadata.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
              >
                {websiteMetadata.url}
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Screenshot */}
          {screenshot_uri ? (
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img src={screenshot_uri} alt={title} className="w-full h-auto" />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">No screenshot available</p>
            </div>
          )}

          {/* Notes */}
          {notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Notes
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Website Information
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {websiteMetadata?.description && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {websiteMetadata.description}
                  </dd>
                </div>
              )}
              {websiteMetadata?.author && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">Author</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {websiteMetadata.author}
                  </dd>
                </div>
              )}
              {websiteMetadata?.publisher && (
                <div>
                  <dt className="text-xs font-medium text-gray-500">
                    Publisher
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {websiteMetadata.publisher}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-gray-500">Added On</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default InspirationDetailModal
