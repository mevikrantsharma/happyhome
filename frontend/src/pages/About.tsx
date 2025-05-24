import React from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import TeamMember, { TeamMemberType } from '../components/about/TeamMember'
import CompanyValues from '../components/about/CompanyValues'
import CompanyTimeline from '../components/about/CompanyTimeline'
import CallToAction from '../components/home/CallToAction'
import AnimatedSection from '../components/shared/AnimatedSection'
import './About.css'

const About = () => {
  const teamMembers: TeamMemberType[] = [
    {
      id: 1,
      name: 'Michael Johnson',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Michael founded HappyHome in 2010 with over 15 years of experience in the construction and design industry. With a background in architecture and business management, he combines creative vision with practical execution. Michael personally oversees major projects and maintains the company\'s commitment to quality and client satisfaction. His passion for transforming living spaces drives the company\'s mission to create homes that truly reflect their owners\' lifestyles and dreams.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Design Director',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      bio: 'Sarah leads our design team with her exceptional creative vision and attention to detail. With a Master\'s degree in Interior Design and over 10 years of experience, she specializes in blending functionality with aesthetics to create spaces that are both beautiful and practical. Sarah stays ahead of design trends while focusing on timeless elements that won\'t quickly become outdated. Her collaborative approach ensures that each client\'s unique style is reflected in their renovation project.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 3,
      name: 'David Rodriguez',
      role: 'Project Manager',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'David brings over 12 years of construction management experience to every project he oversees. His exceptional organizational skills and attention to detail ensure that renovations are completed on time, within budget, and to our exacting quality standards. David excels at coordinating our skilled craftsmen and subcontractors, maintaining clear communication with clients throughout the process, and problem-solving when unexpected challenges arise. His commitment to excellence has been instrumental in building our reputation for reliability.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      role: 'Interior Designer',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      bio: 'Emma specializes in creating cohesive, personalized interiors that reflect each client\'s unique style and needs. With a background in both residential and commercial design, she brings versatility and creativity to every project. Emma has a particular talent for selecting materials, finishes, and furnishings that work together to create harmonious spaces. Her knowledge of sustainable design practices helps clients make eco-friendly choices without compromising on style or functionality.',
      linkedin: 'https://linkedin.com'
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
        title="About Us"
        subtitle="Learn about our company, our team, and our commitment to quality home renovations"
        backgroundImage="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
        metaDescription="Learn about HappyHome's experienced team, company history, and our commitment to quality craftsmanship in home renovation projects."
      />
      
      <section className="about-intro section">
        <div className="container">
          <div className="about-content">
            <AnimatedSection className="about-text">
              <h2>Our Story</h2>
              <p className="lead-text">
                Since 2010, HappyHome has been transforming houses into dream homes with exceptional craftsmanship and personalized service.
              </p>
              <p>
                What began as a small renovation business has grown into a full-service home transformation company serving the entire Bay Area. Our founder, Michael Johnson, started with a simple mission: to provide homeowners with renovation services that truly reflect their lifestyle and needs, delivered with integrity and attention to detail.
              </p>
              <p>
                Over the years, we've assembled a team of talented designers, skilled craftsmen, and experienced project managers who share this passion for creating beautiful, functional living spaces. We've completed hundreds of projects, from kitchen and bathroom remodels to full home renovations, earning a reputation for quality work and exceptional client experiences.
              </p>
              <p>
                Today, we continue to uphold these values while embracing innovation and sustainable practices. Our commitment to excellence in every project, big or small, is what sets us apart and keeps our clients coming back and referring us to friends and family.
              </p>
            </AnimatedSection>
            
            <AnimatedSection className="about-image" delay={0.2}>
              <img 
                src="https://images.pexels.com/photos/3760529/pexels-photo-3760529.jpeg" 
                alt="HappyHome team at work" 
                loading="lazy"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      <CompanyValues />
      
      <section className="team-section section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          
          <div className="team-grid">
            {teamMembers.map((member) => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
      
      <CompanyTimeline />
      
      <CallToAction />
    </motion.div>
  )
}

export default About