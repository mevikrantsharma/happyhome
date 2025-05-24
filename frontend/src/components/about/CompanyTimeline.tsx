import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import './CompanyTimeline.css'

const CompanyTimeline = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const milestones = [
    {
      year: 2010,
      title: 'Company Founded',
      description: 'HappyHome was founded with a vision to transform houses into dream homes through quality craftsmanship and exceptional service.'
    },
    {
      year: 2012,
      title: 'First Major Project',
      description: 'Completed our first full house renovation, establishing our reputation for attention to detail and client satisfaction.'
    },
    {
      year: 2015,
      title: 'Expanded Services',
      description: 'Added kitchen and bathroom specialization teams to meet growing demand for these specific renovation services.'
    },
    {
      year: 2017,
      title: 'Award Recognition',
      description: 'Received Best of Houzz Design Award and local recognition for excellence in home renovations.'
    },
    {
      year: 2019,
      title: 'New Headquarters',
      description: 'Moved to our current location with expanded showroom and design center to better serve our clients.'
    },
    {
      year: 2022,
      title: 'Sustainability Focus',
      description: 'Incorporated eco-friendly materials and energy-efficient practices into all our renovation projects.'
    },
    {
      year: 2024,
      title: 'Digital Transformation',
      description: 'Launched virtual design consultations and 3D visualization tools to enhance the customer experience.'
    }
  ]

  return (
    <section className="timeline-section section">
      <div className="container">
        <h2 className="section-title">Our Journey</h2>
        
        <div className="timeline" ref={ref}>
          <motion.div 
            className="timeline-progress"
            style={{ scaleY: scrollYProgress }}
          ></motion.div>
          
          {milestones.map((milestone, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div className="timeline-year">{milestone.year}</div>
                <h3 className="timeline-title">{milestone.title}</h3>
                <p className="timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompanyTimeline