import React from 'react'
import Logo from './Logo'
import DesktopNavigation from './DesktopNavigation'

const NavbarDesktop: React.FC = () => {
  return (
    <div className="flex items-center">
      <Logo />
      <DesktopNavigation />
    </div>
  )
}

export default NavbarDesktop
