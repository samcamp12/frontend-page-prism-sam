import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const getTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard'
    case '/projects':
      return 'Projects'
    default:
      if (pathname.startsWith('/projects/')) {
        return 'Project Detail'
      }
      return 'Page Prism'
  }
}

const usePageTitle = (customTitle?: string): string => {
  const location = useLocation()
  const [pageTitle, setPageTitle] = useState(
    customTitle || getTitle(location.pathname)
  )

  useEffect(() => {
    const title = customTitle || getTitle(location.pathname)
    setPageTitle(title)
    document.title = `${title} - Page Prism`
  }, [location, customTitle])

  return pageTitle
}

export default usePageTitle
