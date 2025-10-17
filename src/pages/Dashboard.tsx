import React from 'react'
import usePageTitle from '../hooks/usePageTitle'

const Dashboard: React.FC = () => {
  usePageTitle('Dashboard')

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-6">
          <p className="text-gray-600">Welcome to Page Prism</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
