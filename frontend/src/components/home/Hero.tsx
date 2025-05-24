import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Hero.css'

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null])
  
  const videos = [
    '/src/assets/Hero_bg_1.mp4',
    '/src/assets/Hero_bg_2.mp4',
    '/src/assets/Hero_bg_3.mp4'
  ]
  
  // Function to play the next video
  const playNextVideo = () => {
    const nextVideo = (currentVideo + 1) % videos.length
    setCurrentVideo(nextVideo)
  }
  
  // Effect to handle current video changes
  useEffect(() => {
    // When current video changes, play it
    const videoElement = videoRefs.current[currentVideo]
    if (videoElement) {
      videoElement.currentTime = 0
      videoElement.play().catch(error => {
        console.error('Error playing video:', error)
      })
    }
  }, [currentVideo])

  return (
    <section className="hero">
      {videos.map((videoSrc, index) => (
        <video 
          key={index}
          ref={el => videoRefs.current[index] = el}
          className={`hero-video ${index === currentVideo ? 'active' : ''}`}
          muted 
          playsInline
          preload="auto" 
          onEnded={playNextVideo}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ))}
      
      <div className="hero-overlay"></div>
      
      <div className="container hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-title"
        >
          Transform Your Home
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-subtitle"
        >
          Premium renovation services to create the perfect living space
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-buttons"
        >
          <Link to="/services" className="btn btn-primary btn-lg">Our Services</Link>
          <Link to="/contact" className="btn btn-outline btn-lg">Free Consultation</Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero