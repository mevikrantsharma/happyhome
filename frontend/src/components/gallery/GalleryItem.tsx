import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaExpand, FaTimes } from 'react-icons/fa'
import './GalleryItem.css'

export interface GalleryItemType {
  id: number
  title: string
  category: string
  description: string
  location: string
  before: string
  after: string
}

interface GalleryItemProps {
  item: GalleryItemType
}

const GalleryItem = ({ item }: GalleryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAfter, setShowAfter] = useState(true)

  return (
    <>
      <motion.div 
        className="gallery-item"
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="gallery-item-image">
          <div className="before-after-container">
            {/* Before Image */}
            <div 
              className={`before-image ${!showAfter ? 'active' : ''}`}
              style={{ backgroundImage: `url(${item.before})` }}
            >
              <div className="image-label">Before</div>
            </div>
            
            {/* After Image */}
            <div 
              className={`after-image ${showAfter ? 'active' : ''}`}
              style={{ backgroundImage: `url(${item.after})` }}
            >
              <div className="image-label">After</div>
            </div>
          </div>
          
          {/* Toggle Buttons */}
          <div className="toggle-buttons">
            <button 
              className={`toggle-btn ${!showAfter ? 'active' : ''}`}
              onClick={() => setShowAfter(false)}
            >
              Before
            </button>
            <button 
              className={`toggle-btn ${showAfter ? 'active' : ''}`}
              onClick={() => setShowAfter(true)}
            >
              After
            </button>
          </div>
          
          <button 
            className="expand-btn" 
            onClick={() => setIsExpanded(true)}
            aria-label="Expand project"
          >
            <FaExpand />
          </button>
        </div>
        
        <div className="gallery-item-content">
          <h3 className="gallery-item-title">{item.title}</h3>
          <div className="gallery-item-meta">
            <span className="gallery-item-category">{item.category}</span>
            <span className="gallery-item-location">{item.location}</span>
          </div>
        </div>
      </motion.div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="expanded-view">
          <div className="expanded-overlay" onClick={() => setIsExpanded(false)}></div>
          <div className="expanded-content">
            <button 
              className="close-btn" 
              onClick={() => setIsExpanded(false)}
              aria-label="Close expanded view"
            >
              <FaTimes />
            </button>
            
            <div className="expanded-images">
              <div className="expanded-image">
                <img src={item.before} alt={`${item.title} Before`} />
                <div className="expanded-image-label">Before</div>
              </div>
              <div className="expanded-image">
                <img src={item.after} alt={`${item.title} After`} />
                <div className="expanded-image-label">After</div>
              </div>
            </div>
            
            <div className="expanded-details">
              <h3 className="expanded-title">{item.title}</h3>
              <div className="expanded-meta">
                <span className="expanded-category">{item.category}</span>
                <span className="expanded-location">{item.location}</span>
              </div>
              <p className="expanded-description">{item.description}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GalleryItem