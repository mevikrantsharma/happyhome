import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '../shared/AnimatedSection'
import './FeaturedProjects.css'

const FeaturedProjects = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const projects = [
    {
      id: 1,
      title: 'Modern Kitchen Transformation',
      type: 'Kitchen',
      location: 'San Francisco, CA',
      description: 'Complete renovation of a cramped kitchen into an open, modern cooking space with custom cabinetry and high-end appliances.',
      image: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg'
    },
    {
      id: 2,
      title: 'Luxury Master Bathroom',
      type: 'Bathroom',
      location: 'Oakland, CA',
      description: 'Transformation of an outdated bathroom into a spa-like retreat with a freestanding tub, walk-in shower, and custom vanity.',
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg'
    },
    {
      id: 3,
      title: 'Contemporary Home Renovation',
      type: 'Full House',
      location: 'Marin County, CA',
      description: 'Full renovation of a 1970s home with an open floor plan, updated finishes, and modern amenities throughout.',
      image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
    }
  ]

  return (
    <section className="featured-projects section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Featured Projects</h2>
        </AnimatedSection>

        <div className="projects-wrapper">
          <div className="project-showcase">
            <AnimatedSection className="project-images">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="project-image-container"
                >
                  <img 
                    src={projects[activeIndex].image} 
                    alt={`${projects[activeIndex].title}`} 
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </AnimatedSection>

            <AnimatedSection className="project-details" delay={0.2}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`details-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="project-type">{projects[activeIndex].type}</span>
                  <h3 className="project-title">{projects[activeIndex].title}</h3>
                  <p className="project-location">{projects[activeIndex].location}</p>
                  <p className="project-description">{projects[activeIndex].description}</p>
                  <Link to="/gallery" className="btn btn-outline">View Project Details</Link>
                </motion.div>
              </AnimatePresence>
            </AnimatedSection>
          </div>

          <AnimatedSection className="project-navigation" delay={0.3}>
            {projects.map((project, index) => (
              <button
                key={project.id}
                className={`project-nav-item ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className="project-nav-title">{project.title}</span>
                <span className="project-nav-type">{project.type}</span>
              </button>
            ))}
          </AnimatedSection>
        </div>

        <AnimatedSection className="text-center mt-5" delay={0.4}>
          <Link to="/gallery" className="btn btn-primary btn-lg">
            Explore All Projects
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default FeaturedProjects