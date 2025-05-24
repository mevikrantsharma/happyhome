import AnimatedSection from '../shared/AnimatedSection'
import './CompanyValues.css'

const CompanyValues = () => {
  const values = [
    {
      title: 'Quality Craftsmanship',
      description: 'We take pride in our work and deliver exceptional quality in every project, with attention to detail that sets us apart.',
      icon: '🛠️'
    },
    {
      title: 'Client-Focused',
      description: 'Your satisfaction is our priority. We listen carefully to your needs and provide personalized solutions for your unique space.',
      icon: '👂'
    },
    {
      title: 'Integrity',
      description: 'We operate with honesty and transparency in all our dealings, ensuring clear communication and fair pricing.',
      icon: '🤝'
    },
    {
      title: 'Innovation',
      description: 'We embrace new technologies and design trends to bring fresh ideas and better solutions to our renovation projects.',
      icon: '💡'
    },
    {
      title: 'Sustainability',
      description: 'We\'re committed to eco-friendly practices, using sustainable materials and energy-efficient solutions whenever possible.',
      icon: '🌿'
    },
    {
      title: 'Reliability',
      description: 'We deliver on our promises, completing projects on time and within budget, with minimal disruption to your life.',
      icon: '⏱️'
    }
  ]

  return (
    <section className="values-section section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Our Core Values</h2>
        </AnimatedSection>
        
        <div className="values-grid">
          {values.map((value, index) => (
            <AnimatedSection key={index} delay={index * 0.1} className="value-card">
              <div className="value-icon">{value.icon}</div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CompanyValues