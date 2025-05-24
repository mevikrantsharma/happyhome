
import { motion } from 'framer-motion'
import PageHeader from '../components/shared/PageHeader'
import GalleryComponent from '../components/gallery/Gallery'
import CallToAction from '../components/home/CallToAction'

const Gallery = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Project Gallery"
        subtitle="Explore our portfolio of stunning renovation transformations"
        backgroundImage="https://images.pexels.com/photos/7937386/pexels-photo-7937386.jpeg"
        metaDescription="Browse HappyHome's portfolio of kitchen, bathroom, and whole-house renovation projects with stunning before and after transformations."
      />
      
      <GalleryComponent />
      
      <CallToAction />
    </motion.div>
  )
}

export default Gallery