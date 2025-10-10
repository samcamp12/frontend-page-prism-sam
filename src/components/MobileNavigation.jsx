import { DisclosureButton } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import styles from './MobileNavigation.module.css'

import { NAVIGATION_ITEMS } from '../constants/navigation'

const MobileNavigation = () => {
  const location = useLocation()

  return (
    <div className={styles.navigationContainer}>
      {NAVIGATION_ITEMS.map((item) => (
        <DisclosureButton
          key={item.name}
          as={Link}
          to={item.href}
          className={clsx(
            styles.navigationItem,
            location.pathname === item.href
              ? styles.navigationItemCurrent
              : styles.navigationItemDefault
          )}
          aria-current={location.pathname === item.href ? 'page' : undefined}
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}

export default MobileNavigation
