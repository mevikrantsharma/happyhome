import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import ServiceDetail from '../components/services/ServiceDetail'
import ProcessSteps from '../components/services/ProcessSteps'
import CallToAction from '../components/home/CallToAction'

const Services = () => {
  const services = [
    {
      id: 'kitchen',
      title: 'Kitchen Renovation',
      description: 'Transform your kitchen into a modern, functional space that serves as the heart of your home. Our kitchen renovations combine beautiful aesthetics with practical layouts designed for how you live and cook.',
      features: [
        { text: 'Custom cabinetry tailored to your storage needs' },
        { text: 'Premium countertops in granite, quartz, or marble' },
        { text: 'Energy-efficient appliance installation' },
        { text: 'Task-focused lighting solutions' },
        { text: 'Island additions and open-concept designs' },
        { text: 'Durable flooring options from hardwood to tile' }
      ],
      image: 'https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg'
    },
    {
      id: 'bathroom',
      title: 'Bathroom Remodeling',
      description: 'Create a luxurious bathroom retreat that combines functionality with spa-like comfort. From simple updates to complete transformations, we design bathrooms that suit your style and practical needs.',
      features: [
        { text: 'Custom walk-in showers and soaking tubs' },
        { text: 'Elegant vanities and storage solutions' },
        { text: 'Premium fixtures and hardware' },
        { text: 'Heated flooring options' },
        { text: 'Water-efficient toilets and fixtures' },
        { text: 'Mold-resistant materials for lasting beauty' }
      ],
      image: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg'
    },
    {
      id: 'full-house',
      title: 'Full House Renovation',
      description: 'Completely transform your home with a comprehensive renovation that addresses all aspects of your living space. We can update outdated features, improve flow between rooms, and modernize your entire home.',
      features: [
        { text: 'Open-concept layouts to maximize space' },
        { text: 'Updated electrical and plumbing systems' },
        { text: 'Energy-efficient windows and insulation' },
        { text: 'Modern flooring throughout the home' },
        { text: 'Fresh paint, trim, and architectural details' },
        { text: 'Smart home technology integration' }
      ],
      image: 'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'
    },
    {
      id: 'basement',
      title: 'Basement Finishing',
      description: 'Transform your unfinished basement into valuable living space that adds both function and value to your home. From home theaters to guest suites, we help you maximize this often underutilized area.',
      features: [
        { text: 'Moisture control and proper insulation' },
        { text: 'Legal egress solutions for safety' },
        { text: 'Entertainment spaces and home theaters' },
        { text: 'Additional bedrooms and bathrooms' },
        { text: 'Home office or workout areas' },
        { text: 'Built-in storage solutions' }
      ],
      image: 'https://images.pexels.com/photos/3214264/pexels-photo-3214264.jpeg'
    },
    {
      id: 'addition',
      title: 'Home Additions',
      description: 'Expand your living space with seamlessly integrated home additions that match your existing architecture while providing much-needed extra room for your growing needs.',
      features: [
        { text: 'Second story additions' },
        { text: 'Main floor expansions' },
        { text: 'Sunrooms and enclosed porches' },
        { text: 'Master suite additions' },
        { text: 'Architectural matching with existing structure' },
        { text: 'Foundation and structural engineering' }
      ],
      image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Our Services"
        subtitle="Explore our comprehensive home renovation services tailored to transform your space"
        backgroundImage="https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg"
        metaDescription="HappyHome offers a complete range of renovation services including kitchen remodeling, bathroom renovations, and full house transformations."
      />
      
      <section className="services-list">
        {services.map((service, index) => (
          <ServiceDetail
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            features={service.features}
            image={service.image}
            reversed={index % 2 !== 0}
          />
        ))}
      </section>

      <ProcessSteps />
      <CallToAction />
    </motion.div>
  )
}

export default Services