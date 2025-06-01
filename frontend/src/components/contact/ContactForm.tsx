import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'framer-motion'
import './ContactForm.css'

interface ContactFormInputs {
  name: string
  email: string
  phone: string
  message: string
  service: string
}

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ContactFormInputs>()

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitting(true)
    
    try {
      console.log('Submitting contact form data:', data)
      
      // Send data to backend API
      const response = await fetch('http://localhost:4000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        console.log('Contact form submitted successfully:', result)
        setIsSubmitted(true)
        
        // Reset form fields after successful submission if needed
        // reset()
      } else {
        console.error('Error submitting form:', result)
        // Show more detailed error message if available
        const errorMessage = result.error ? 
          (Array.isArray(result.error) ? result.error.join(', ') : result.error) : 
          'There was an error submitting your message. Please try again.';
        alert(errorMessage)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please check your internet connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    { value: "", label: "Select a service" },
    { value: "kitchen", label: "Kitchen Renovation" },
    { value: "bathroom", label: "Bathroom Remodeling" },
    { value: "full-house", label: "Full House Renovation" },
    { value: "basement", label: "Basement Finishing" },
    { value: "addition", label: "Home Addition" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="contact-form-container">
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="form-success"
        >
          <div className="success-icon">✓</div>
          <h3>Thank You!</h3>
          <p>Your message has been sent successfully. One of our team members will contact you soon.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsSubmitted(false)}
          >
            Send Another Message
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={errors.name ? 'error' : ''}
              placeholder="Your name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="error-message">{errors.name.message}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={errors.email ? 'error' : ''}
                placeholder="Your email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                className={errors.phone ? 'error' : ''}
                placeholder="Your phone number"
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-().]{10,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="service">Service of Interest</label>
            <select
              id="service"
              className={errors.service ? 'error' : ''}
              {...register('service', { required: 'Please select a service' })}
            >
              {services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            {errors.service && <span className="error-message">{errors.service.message}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className={errors.message ? 'error' : ''}
              placeholder="Tell us about your project"
              rows={5}
              {...register('message', { required: 'Message is required' })}
            ></textarea>
            {errors.message && <span className="error-message">{errors.message.message}</span>}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-lg submit-btn" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm