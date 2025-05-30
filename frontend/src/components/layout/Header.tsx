import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthContext } from '../../context/AuthContext'
import Logo from '../shared/Logo'
import { FaBars, FaTimes, FaUser } from 'react-icons/fa'
import './Header.css'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useContext(AuthContext)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false)
  }, [location])

  const headerClass = isScrolled ? 'header scrolled' : 'header'

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ]
  
  // Close user menu when route changes
  useEffect(() => {
    setUserMenuOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Determine which page we're on for styling purposes
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.substring(1)
  
  return (
    <header className={headerClass} data-page={currentPage}>
      <div className="header-container">
        <Link to="/" className="logo-container">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`${location.pathname === link.path ? 'active' : ''} ${link.label === 'Contact' ? 'contact-button' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            
            {/* Auth Links */}
            {isAuthenticated() ? (
              <li className="user-menu-container">
                <button 
                  className="user-menu-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <FaUser />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                </button>
                
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <Link to="/dashboard" className="dropdown-item">My Dashboard</Link>
                    <Link to="/profile" className="dropdown-item">My Profile</Link>
                    <Link to="/wishlist" className="dropdown-item">My Collections</Link>
                    <button onClick={handleLogout} className="dropdown-item logout">Logout</button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/login" className="login-button">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.nav 
              className="mobile-nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="mobile-nav-links">
                {navLinks.map((link) => (
                  <motion.li 
                    key={link.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * navLinks.indexOf(link) }}
                  >
                    <Link 
                      to={link.path} 
                      className={`${location.pathname === link.path ? 'active' : ''} ${link.label === 'Contact' ? 'mobile-contact-button' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                
                {/* Mobile Auth Links */}
                {isAuthenticated() ? (
                  <>
                    <motion.li
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (navLinks.length + 1) }}
                    >
                      <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        My Dashboard
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (navLinks.length + 2) }}
                    >
                      <Link to="/profile" className={`${location.pathname === '/profile' ? 'active' : ''}`}>
                        My Profile
                      </Link>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (navLinks.length + 2) }}
                    >
                      <button onClick={handleLogout} className="mobile-logout-button">
                        Logout
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (navLinks.length + 1) }}
                  >
                    <Link to="/login" className="mobile-login-button">
                      Login
                    </Link>
                  </motion.li>
                )}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

export default Header