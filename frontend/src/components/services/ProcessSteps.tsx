import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './ProcessSteps.css'

const ProcessSteps = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      number: 1,
      title: 'Initial Consultation',
      description: 'We meet to discuss your vision, needs, budget, and timeline for your renovation project.'
    },
    {
      number: 2,
      title: 'Design & Planning',
      description: 'Our designers create detailed plans and 3D renderings to visualize your project before construction begins.'
    },
    {
      number: 3,
      title: 'Proposal & Contract',
      description: 'We provide a comprehensive proposal outlining scope, materials, timeline, and costs for your review and approval.'
    },
    {
      number: 4,
      title: 'Construction',
      description: 'Our skilled craftsmen execute the renovation with attention to detail, quality, and cleanliness.'
    },
    {
      number: 5,
      title: 'Final Walkthrough',
      description: 'We conduct a thorough inspection with you to ensure every detail meets our high standards and your expectations.'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section className="process-steps section">
      <div className="container">
        <h2 className="section-title">Our Renovation Process</h2>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="steps-container"
        >
          {steps.map((step) => (
            <motion.div 
              key={step.number}
              variants={itemVariants}
              className="step-card"
            >
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default ProcessSteps