import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage: string
  metaDescription?: string
}

const PageHeader = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  metaDescription 
}: PageHeaderProps) => {
  return (
    <>
      <Helmet>
        <title>{`${title} | HappyHome Renovation`}</title>
        {metaDescription && <meta name="description" content={metaDescription} />}
      </Helmet>
      
      <section 
        className="page-header" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="overlay"></div>
        <div className="page-header-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="page-title"
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="page-subtitle"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>
    </>
  )
}

export default PageHeader