import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import ContactForm from '../components/contact/ContactForm'

import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import './Contact.css'

const Contact = () => {
  // No longer need tabs since we're removing the appointment scheduler

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Contact Us"
        subtitle="Reach out to discuss your renovation project or schedule a consultation"
        backgroundImage="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
        metaDescription="Contact HappyHome Renovation for information or to schedule a free consultation for your home renovation project."
      />
      
      <section className="contact-section section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <p className="contact-intro">
                Whether you're ready to start your renovation project or just have questions, our team is here to help. Reach out through our contact form or schedule a free consultation. We typically respond within 24 hours.
              </p>
              
              <ul className="contact-details">
                <li>
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4>Our Office</h4>
                    <p>123 Renovation Ave, Suite 100<br/>San Francisco, CA 94107</p>
                  </div>
                </li>
                <li>
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>(555) 123-4567</p>
                  </div>
                </li>
                <li>
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>info@happyhome.com</p>
                  </div>
                </li>
                <li>
                  <div className="contact-icon">
                    <FaClock />
                  </div>
                  <div>
                    <h4>Hours</h4>
                    <p>Monday - Friday: 9AM - 5PM<br/>Saturday: 10AM - 2PM</p>
                  </div>
                </li>
              </ul>
              
              <div className="contact-map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1642543493618!5m2!1sen!2sus" 
                  width="100%" 
                  height="250" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy"
                  title="Google Maps location of HappyHome"
                ></iframe>
              </div>
            </div>
            
            <div className="contact-form-section">
              <div className="form-header">
                <h3>Send a Message</h3>
                <p>Fill out the form below and our team will get back to you shortly.</p>
              </div>
              
              <div className="contact-form-wrapper">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact