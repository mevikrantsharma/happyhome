import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaCheck } from 'react-icons/fa'
import './ServiceDetail.css'

interface Feature {
  text: string
}

interface ServiceDetailProps {
  id: string
  title: string
  description: string
  features: Feature[]
  image: string
  reversed?: boolean
}

const ServiceDetail = ({ 
  id, 
  title, 
  description, 
  features, 
  image, 
  reversed = false 
}: ServiceDetailProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    // Handle URL hash navigation
    if (window.location.hash === `#${id}` && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }
  }, [id])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div 
      ref={sectionRef}
      id={id} 
      className={`service-detail ${reversed ? 'reversed' : ''}`}
    >
      <div ref={ref} className="service-detail-content">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="service-detail-text"
        >
          <motion.h3 variants={itemVariants} className="service-detail-title">{title}</motion.h3>
          <motion.p variants={itemVariants} className="service-detail-description">{description}</motion.p>
          
          <motion.ul variants={containerVariants} className="service-features">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                variants={itemVariants}
                className="service-feature"
              >
                <FaCheck className="feature-icon" />
                <span>{feature.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: reversed ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: reversed ? -30 : 30 }}
          transition={{ duration: 0.8 }}
          className="service-detail-image"
        >
          <img src={image} alt={title} loading="lazy" />
        </motion.div>
      </div>
    </div>
  )
}

export default ServiceDetail