import React from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  title?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'Page Prism' }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}

export default Header
