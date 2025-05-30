import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalculator, FaArrowRight } from 'react-icons/fa';
import './HomeTools.css';

const HomeTools = () => {
  return (
    <section className="home-tools-section">
      <div className="container">
        <div className="section-header">
          <h2>Helpful Renovation Tools</h2>
          <p>Plan your renovation with our free interactive tools</p>
        </div>
        
        <div className="tools-grid">
          <div className="tool-card">
            <div className="tool-icon">
              <FaCalculator />
            </div>
            <div className="tool-content">
              <h3>Renovation Cost Estimator</h3>
              <p>Get instant cost estimates based on your room dimensions and preferences. Plan your budget with our easy-to-use calculator.</p>
              <ul className="tool-features">
                <li>Room-specific calculations</li>
                <li>Material quality options</li>
                <li>Detailed cost breakdown</li>
              </ul>
              <Link to="/cost-estimator" className="tool-link">
                Try Cost Estimator <FaArrowRight />
              </Link>
            </div>
          </div>
          
          {/* Placeholder for future tools */}
          {/*
          <div className="tool-card">
            <div className="tool-icon">
              <FaRuler />
            </div>
            <div className="tool-content">
              <h3>Room Planner</h3>
              <p>Visualize your space with our room planning tool.</p>
              <Link to="/room-planner" className="tool-link">
                Try Room Planner <FaArrowRight />
              </Link>
            </div>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default HomeTools;
