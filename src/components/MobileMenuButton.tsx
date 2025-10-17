import React from 'react'
import { DisclosureButton } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import styles from './MobileMenuButton.module.css'

interface MobileMenuButtonProps {
  open: boolean
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ open }) => {
  return (
    <DisclosureButton className={styles.button}>
      <span className="sr-only">Open main menu</span>
      {open ? (
        <XMarkIcon className={styles.icon} aria-hidden="true" />
      ) : (
        <Bars3Icon className={styles.icon} aria-hidden="true" />
      )}
    </DisclosureButton>
  )
}

export default MobileMenuButton
