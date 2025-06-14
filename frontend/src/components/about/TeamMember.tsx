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
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TeamMember