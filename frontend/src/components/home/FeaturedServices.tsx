import { Link } from 'react-router-dom'
import AnimatedSection from '../shared/AnimatedSection'
import { FaHammer, FaBath, FaHome, FaPlusSquare } from 'react-icons/fa'
import './FeaturedServices.css'

const FeaturedServices = () => {
  const services = [
    {
      id: 'kitchen',
      icon: <FaHammer />,
      title: 'Kitchen Renovation',
      description: 'Transform your kitchen into a modern, functional space with custom cabinetry, premium countertops, and energy-efficient appliances.',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
    },
    {
      id: 'bathroom',
      icon: <FaBath />,
      title: 'Bathroom Remodeling',
      description: 'Create a luxurious bathroom retreat with custom showers, freestanding tubs, premium fixtures, and elegant tiling.',
      image: 'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg'
    },
    {
      id: 'full-house',
      icon: <FaHome />,
      title: 'Full House Renovation',
      description: 'Complete transformation of your home with open-concept designs, modern finishes, and energy-efficient upgrades.',
      image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
    },
    {
      id: 'addition',
      icon: <FaPlusSquare />,
      title: 'Home Additions',
      description: 'Expand your living space with seamlessly integrated room additions, second stories, or extended living areas.',
      image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'
    }
  ]

  return (
    <section className="featured-services section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Our Services</h2>
        </AnimatedSection>

        <div className="services-grid">
          {services.map((service, index) => (
            <AnimatedSection 
              key={service.id} 
              className="service-card" 
              delay={index * 0.1}
            >
              <div className="service-image">
                <img src={service.image} alt={service.title} loading="lazy" />
                <div className="service-icon">{service.icon}</div>
              </div>
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <Link to={`/services#${service.id}`} className="service-link">
                  Learn More
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-5">
          <Link to="/services" className="btn btn-primary btn-lg">
            View All Services
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default FeaturedServices