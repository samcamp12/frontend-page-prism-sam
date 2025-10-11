import DesktopNavigation from '../DesktopNavigation/DesktopNavigation'
import Logo from '../Logo'

const NavbarDesktop = () => {
  return (
    <div className="flex items-center">
      <Logo />
      <DesktopNavigation />
    </div>
  )
}

export default NavbarDesktop
