import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '../shared/AnimatedSection'
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'
import './Testimonials.css'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'San Francisco, CA',
      project: 'Kitchen Renovation',
      quote: 'HappyHome transformed our outdated kitchen into a stunning, functional space that has become the heart of our home. Their attention to detail and craftsmanship exceeded our expectations!',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael & Lisa Chen',
      location: 'Oakland, CA',
      project: 'Bathroom Remodeling',
      quote: 'We couldn\'t be happier with our new bathrooms. The design team listened to our needs and created spaces that are both beautiful and practical. The project was completed on time and within budget.',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      rating: 5
    },
    {
      id: 3,
      name: 'Robert Taylor',
      location: 'Marin County, CA',
      project: 'Full House Renovation',
      quote: 'HappyHome guided us through a complete home renovation with professionalism and expertise. They transformed our dated property into a modern, open-concept dream home. Highly recommended!',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      rating: 5
    }
  ]

  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    )
  }

  return (
    <section className="testimonials section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">What Our Clients Say</h2>
        </AnimatedSection>

        <div className="testimonial-slider">
          <button 
            className="testimonial-nav prev" 
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>

          <div className="testimonial-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeIndex].id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="testimonial"
              >
                <div className="testimonial-content">
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-quote">{testimonials[activeIndex].quote}</p>
                  
                  <div className="testimonial-rating">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  
                  <div className="testimonial-meta">
                    <h4 className="testimonial-name">{testimonials[activeIndex].name}</h4>
                    <p className="testimonial-location">{testimonials[activeIndex].location}</p>
                    <p className="testimonial-project">{testimonials[activeIndex].project}</p>
                  </div>
                </div>
                
                <div className="testimonial-image">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name} 
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            className="testimonial-nav next" 
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials