import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../shared/Logo'
import { FaFacebook, FaInstagram, FaPinterest, FaHouzz, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-column">
          <div className="footer-logo">
            <Logo />
          </div>
          <p className="footer-description">
            Transforming houses into dream homes since 2010. Quality craftsmanship and exceptional renovation services.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <FaPinterest />
            </a>
            <a href="https://houzz.com" target="_blank" rel="noopener noreferrer" aria-label="Houzz">
              <FaHouzz />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Services</h3>
          <ul className="footer-links">
            <li><Link to="/services#kitchen">Kitchen Renovation</Link></li>
            <li><Link to="/services#bathroom">Bathroom Remodeling</Link></li>
            <li><Link to="/services#full-house">Full House Renovation</Link></li>
            <li><Link to="/services#basement">Basement Finishing</Link></li>
            <li><Link to="/services#addition">Home Additions</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact-info">
            <li>
              <FaMapMarkerAlt />
              <span>123 Renovation Ave, Suite 100<br/>San Francisco, CA 94107</span>
            </li>
            <li>
              <FaPhone />
              <span>(555) 123-4567</span>
            </li>
            <li>
              <FaEnvelope />
              <span>info@happyhome.com</span>
            </li>
          </ul>
          <Link to="/contact" className="btn btn-outline">Get a Free Quote</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} HappyHome. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer