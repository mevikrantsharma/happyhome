import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import Hero from '../components/home/Hero'
import FeaturedServices from '../components/home/FeaturedServices'
import FeaturedProjects from '../components/home/FeaturedProjects'
import HomeTools from '../components/home/HomeTools'
import ReviewsTestimonials from '../components/home/ReviewsTestimonials'
import CallToAction from '../components/home/CallToAction'

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>HappyHome | Premium Home Renovation</title>
        <meta 
          name="description" 
          content="HappyHome offers premium home renovation services including kitchen remodeling, bathroom renovations, and full house transformations."
        />
        <meta property="og:title" content="HappyHome Renovation" />
        <meta property="og:description" content="Transform your home with our professional renovation services" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Hero />
      <FeaturedServices />
      <FeaturedProjects />
      <HomeTools />
      <ReviewsTestimonials />
      <CallToAction />
    </motion.div>
  )
}

export default Home