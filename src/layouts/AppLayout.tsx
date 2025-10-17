import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import ErrorBoundary from '../components/ErrorBoundary'
import usePageTitle from '../hooks/usePageTitle'
import styles from './AppLayout.module.css'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const title = usePageTitle()

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <Navbar />
        <Header title={title} />
        <main>
          <div className={styles.main}>{children}</div>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default AppLayout
