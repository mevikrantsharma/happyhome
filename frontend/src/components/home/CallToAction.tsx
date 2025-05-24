import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedSection from '../shared/AnimatedSection'
import './CallToAction.css'

const CallToAction = () => {
  return (
    <section className="cta">
      <div className="container">
        <div className="cta-content">
          <AnimatedSection delay={0.1}>
            <h2 className="cta-title">Ready to Transform Your Home?</h2>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2}>
            <p className="cta-text">
              Schedule a free consultation with our design experts to discuss your renovation project.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.3}>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-accent btn-lg">Schedule Consultation</Link>
              <Link to="/gallery" className="btn btn-outline btn-lg">View Our Work</Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default CallToAction