import styles from './Button.module.css'
import clsx from 'clsx'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button type="button" className={clsx(styles.button, className)} {...props}>
      {children}
    </button>
  )
}

export default Button
