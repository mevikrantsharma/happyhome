import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './GalleryFilter.css'

interface FilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const GalleryFilter = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="gallery-filter">
      {/* Desktop Filter */}
      <div className="desktop-filter">
        <button 
          className={`filter-button ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => onCategoryChange('all')}
        >
          All Projects
        </button>
        
        {categories.map((category) => (
          <button 
            key={category}
            className={`filter-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mobile Filter */}
      <div className="mobile-filter">
        <button 
          className="mobile-filter-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {activeCategory === 'all' ? 'All Projects' : activeCategory} <span>▼</span>
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mobile-dropdown"
            >
              <button 
                className={`mobile-filter-option ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => {
                  onCategoryChange('all')
                  setIsOpen(false)
                }}
              >
                All Projects
              </button>
              
              {categories.map((category) => (
                <button 
                  key={category}
                  className={`mobile-filter-option ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    onCategoryChange(category)
                    setIsOpen(false)
                  }}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GalleryFilter