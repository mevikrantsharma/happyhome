import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaExpand, FaTimes } from 'react-icons/fa'
import './GalleryItem.css'

export interface GalleryItemType {
  id?: number
  _id?: string
  title: string
  category: string
  description: string
  location?: string
  image?: string
  imageUrl?: string
}

interface GalleryItemProps {
  item: GalleryItemType
}

const GalleryItem = ({ item }: GalleryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

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
          <div className="image-container">
            <img 
              src={item.image || item.imageUrl} 
              alt={item.title} 
              className="gallery-image"
            />
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
            
            <div className="expanded-image-container">
              <img 
                src={item.image || item.imageUrl} 
                alt={item.title} 
                className="expanded-image"
              />
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