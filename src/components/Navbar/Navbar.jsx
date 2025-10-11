import { Disclosure } from '@headlessui/react'
import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'

import styles from './Navbar.module.css'
import MobileMenuButton from '../MobileMenuButton/MobileMenuButton'

const Navbar = () => {
  return (
    <Disclosure as="nav" className={styles.nav}>
      {({ open }) => (
        <>
          <div className={styles.container}>
            <div className={styles.innerContainer}>
              <NavbarDesktop />
              <div className={styles.mobileMenuContainer}>
                <MobileMenuButton open={open} />
              </div>
            </div>
          </div>
          <NavbarMobile />
        </>
      )}
    </Disclosure>
  )
}

export default Navbar
