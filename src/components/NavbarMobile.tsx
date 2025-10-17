import React from 'react'
import { DisclosurePanel } from '@headlessui/react'
import MobileNavigation from './MobileNavigation'

const NavbarMobile: React.FC = () => {
  return (
    <DisclosurePanel className="md:hidden">
      <MobileNavigation />
    </DisclosurePanel>
  )
}

export default NavbarMobile
