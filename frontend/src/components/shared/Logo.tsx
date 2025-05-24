import React from 'react'
import { useLocation } from 'react-router-dom'
import './Logo.css'

const Logo = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isScrolled = window.scrollY > 50
  
  // Determine text color based on page and scroll position
  let textColor = 'var(--color-primary-800)'
  
  if (isHome && !isScrolled) {
    textColor = 'white'
  }

  return (
    <div className="logo">
      <div className="logo-icon" style={{ color: textColor }}>
        <span>H</span>
        <span>H</span>
      </div>
      <div className="logo-text" style={{ color: textColor }}>
        <span className="logo-name">happy<strong>home</strong></span>
      </div>
    </div>
  )
}

export default Logo