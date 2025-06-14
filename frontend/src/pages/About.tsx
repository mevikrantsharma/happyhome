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
      name: 'Aayush Raj',
      role: 'Founder & CEO',
      image: 'src/assets/aayush.jpg',
      bio: 'Aayush Raj founded HappyHome in 2010 with over 15 years of experience in the construction and design industry.',
      linkedin: 'https://www.linkedin.com/in/aayushrajbca'
    },
    {
      id: 2,
      name: 'Md Ashraf Iqbal',
      role: 'Co-Founder',
      image: 'src/assets/ashraf.jpg',
      bio: 'Md Ashraf Iqbal leads our design team with his exceptional creative vision and attention to detail.',
      linkedin: 'https://www.linkedin.com/in/mohammad-ashraf-iqbal-8810b8242'
    },
    {
      id: 3,
      name: 'Kaushik Ranjan',
      role: 'Co-Founder',
      image: 'src/assets/kaushik.jpg',
      bio: 'Kaushik Ranjan brings over 12 years of construction management experience to every project he oversees.',
      linkedin: 'https://www.linkedin.com/in/mekaushikranjan'
    },
    {
      id: 4,
      name: 'Md Aman Nazir',
      role: 'Co-Founder',
      image: 'src/assets/aman.jpg',
      bio: 'Md Aman Nazir specializes in creating cohesive, personalized interiors that reflect each client\'s unique style and needs.',
      linkedin: 'https://www.linkedin.com/in/amannazir'
    },
    {
      id: 5,
      name: 'Vikrant Sharma',
      role: 'Co-Founder',
      image: 'src/assets/vikrant.jpg',
      bio: 'Vikrant Sharma specializes in creating cohesive, personalized interiors that reflect each client\'s unique style and needs.',
      linkedin: 'https://www.linkedin.com/in/mevikrantsharma'
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