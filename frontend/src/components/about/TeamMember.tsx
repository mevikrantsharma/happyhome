import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaLinkedin } from 'react-icons/fa'
import './TeamMember.css'

export interface TeamMemberType {
  id: number
  name: string
  role: string
  image: string
  bio: string
  linkedin?: string
}

interface TeamMemberProps {
  member: TeamMemberType
}

const TeamMember = ({ member }: TeamMemberProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="team-member">
      <div className="member-image">
        <img src={member.image} alt={member.name} loading="lazy" />
        {member.linkedin && (
          <a 
            href={member.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <FaLinkedin />
          </a>
        )}
      </div>
      
      <div className="member-info">
        <h3 className="member-name">{member.name}</h3>
        <p className="member-role">{member.role}</p>
        
        <div className="member-bio-container">
          <p className="member-bio-preview">
            {member.bio.substring(0, 100)}
            {member.bio.length > 100 ? '...' : ''}
          </p>
          
          {member.bio.length > 100 && (
            <button 
              className="read-more-btn"
              onClick={() => setIsExpanded(true)}
              aria-label="Read more about team member"
            >
              Read More
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="member-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button 
                className="close-modal"
                onClick={() => setIsExpanded(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
              
              <div className="modal-body">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="modal-image"
                  loading="lazy"
                />
                
                <div className="modal-info">
                  <h3>{member.name}</h3>
                  <p className="modal-role">{member.role}</p>
                  <p className="modal-bio">{member.bio}</p>
                  
                  {member.linkedin && (
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="modal-social"
                      aria-label={`${member.name}'s LinkedIn profile`}
                    >
                      <FaLinkedin /> Connect on LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TeamMember