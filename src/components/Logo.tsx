import React from 'react'
import logo from '../assets/logo.svg'

const Logo: React.FC = () => {
  return (
    <div className="flex-shrink-0">
      <a href="/">
        <img className="h-8" src={logo} alt="Page Prism" />
      </a>
    </div>
  )
}

export default Logo
