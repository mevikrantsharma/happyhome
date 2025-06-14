import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaInfoCircle, FaArrowRight, FaRupeeSign } from 'react-icons/fa';
import './CostEstimator.css';

const CostEstimator = () => {
  // Form state
  const [formData, setFormData] = useState({
    roomType: 'living',
    width: 0,
    length: 0,
    renovationType: 'basic',
    materialGrade: 'economy',
    includeFlooring: true,
    includePainting: true,
  });

  // Results state
  const [estimate, setEstimate] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Pricing data (per square foot) - in Indian Rupees (₹)
  const basePrices = {
    living: { economy: 1500, standard: 2800, premium: 4500 },
    bedroom: { economy: 1400, standard: 2500, premium: 4200 },
    kitchen: { economy: 4000, standard: 8000, premium: 15000 },
    bathroom: { economy: 5500, standard: 10000, premium: 18000 },
    basement: { economy: 2000, standard: 3500, premium: 6500 },
  };

  // Renovation type multipliers
  const renovationMultipliers = {
    basic: 1.0,    // Simple refresh (paint, minor repairs)
    moderate: 1.5, // Some structural changes
    extensive: 2.2, // Complete renovation
    custom: 3.0,   // High-end custom design
  };

  // Additional costs - in Indian Rupees (₹)
  const additionalCosts = {
    flooring: { economy: 400, standard: 800, premium: 2000 }, // per sq ft
    painting: { economy: 250, standard: 400, premium: 650 },  // per sq ft
  };

  // Room type descriptions
  const roomDescriptions = {
    living: "Living rooms typically include flooring, painting, lighting, and possibly built-in shelving.",
    bedroom: "Bedrooms usually involve flooring, painting, lighting, and closet renovations.",
    kitchen: "Kitchen renovations can include cabinets, countertops, appliances, flooring, and backsplashes.",
    bathroom: "Bathrooms involve fixtures, tiling, vanities, showers/tubs, and waterproofing.",
    basement: "Basement renovations may include waterproofing, insulation, drywall, flooring, and lighting.",
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Calculate square footage
  const calculateArea = () => {
    return formData.width * formData.length;
  };

  // Calculate estimate
  const calculateEstimate = () => {
    const area = calculateArea();
    
    // Base cost calculation
    const baseRate = basePrices[formData.roomType][formData.materialGrade];
    const renovationMultiplier = renovationMultipliers[formData.renovationType];
    let baseCost = area * baseRate * renovationMultiplier;
    
    // Additional costs
    let additionalCost = 0;
    
    if (formData.includeFlooring) {
      additionalCost += area * additionalCosts.flooring[formData.materialGrade];
    }
    
    if (formData.includePainting) {
      additionalCost += area * additionalCosts.painting[formData.materialGrade];
    }
    
    // Total material cost
    const materialCost = baseCost + additionalCost;
    
    // Total cost
    const totalCost = materialCost;
    
    // Calculate low and high range (±15%)
    const lowRange = totalCost * 0.85;
    const highRange = totalCost * 1.15;
    
    // Return the estimate object
    return {
      roomType: formData.roomType,
      area,
      materialGrade: formData.materialGrade,
      renovationType: formData.renovationType,
      baseCost,
      additionalCost,
      totalCost,
      lowRange,
      highRange
    };
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedEstimate = calculateEstimate();
    setEstimate(calculatedEstimate);
    setShowResults(true);
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      roomType: 'living',
      width: 0,
      length: 0,
      renovationType: 'basic',
      materialGrade: 'economy',
      includeLabor: true,
      includeFlooring: true,
      includePainting: true,
    });
    setEstimate(null);
    setShowResults(false);
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="cost-estimator-container">
      <div className="estimator-header">
        <h1><FaCalculator /> Renovation Cost Estimator</h1>
        <p>Get a rough estimate of your renovation costs based on your room dimensions and preferences.</p>
      </div>

      <div className="estimator-content">
        <form onSubmit={handleSubmit} className="estimator-form">
          <div className="form-section">
            <h2>Room Information</h2>
            
            <div className="form-group">
              <label htmlFor="roomType">Room Type</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                required
              >
                <option value="living">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
                <option value="basement">Basement</option>
              </select>
              <div className="form-help">
                <FaInfoCircle /> {roomDescriptions[formData.roomType]}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="width">Width (feet)</label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  min="1"
                  max="100"
                  value={formData.width}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="length">Length (feet)</label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  min="1"
                  max="100"
                  value={formData.length}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group calculated-area">
              <span>Room Area: {calculateArea()} sq ft</span>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Renovation Details</h2>
            
            <div className="form-group">
              <label htmlFor="renovationType">Renovation Type</label>
              <select
                id="renovationType"
                name="renovationType"
                value={formData.renovationType}
                onChange={handleInputChange}
                required
              >
                <option value="basic">Basic (Paint, minor repairs)</option>
                <option value="moderate">Moderate (Some structural changes)</option>
                <option value="extensive">Extensive (Complete renovation)</option>
                <option value="custom">Custom (High-end design)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="materialGrade">Material Quality</label>
              <div className="material-grade-selector">
                <div 
                  className={`material-option ${formData.materialGrade === 'economy' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, materialGrade: 'economy' }))}
                >
                  <div className="option-header">
                    <h3>Economy</h3>
                    <span><FaRupeeSign /></span>
                  </div>
                  <p>Budget-friendly materials with basic functionality</p>
                </div>
                
                <div 
                  className={`material-option ${formData.materialGrade === 'standard' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, materialGrade: 'standard' }))}
                >
                  <div className="option-header">
                    <h3>Standard</h3>
                    <span><FaRupeeSign /><FaRupeeSign /></span>
                  </div>
                  <p>Mid-range quality with good durability</p>
                </div>
                
                <div 
                  className={`material-option ${formData.materialGrade === 'premium' ? 'selected' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, materialGrade: 'premium' }))}
                >
                  <div className="option-header">
                    <h3>Premium</h3>
                    <span><FaRupeeSign /><FaRupeeSign /><FaRupeeSign /></span>
                  </div>
                  <p>High-end materials with superior quality</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Additional Options</h2>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="includeFlooring"
                  checked={formData.includeFlooring}
                  onChange={handleInputChange}
                />
                <span className="checkbox-label">Include Flooring</span>
              </label>
              
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="includePainting"
                  checked={formData.includePainting}
                  onChange={handleInputChange}
                />
                <span className="checkbox-label">Include Painting</span>
              </label>
              

            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="calculate-button">
              Calculate Estimate <FaArrowRight />
            </button>
            <button type="button" onClick={handleReset} className="reset-button">
              Reset
            </button>
          </div>
        </form>
        
        {showResults && estimate && (
          <motion.div 
            className="estimate-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Your Renovation Estimate</h2>
            
            <div className="estimate-summary">
              <div className="estimate-range">
                <span className="range-label">Estimated Cost Range:</span>
                <span className="range-value">
                  {formatCurrency(estimate.lowRange)} - {formatCurrency(estimate.highRange)}
                </span>
              </div>
              
              <div className="room-summary">
                <p>
                  <strong>{estimate.area} sq ft</strong> {formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)} with 
                  <strong> {formData.renovationType.charAt(0).toUpperCase() + formData.renovationType.slice(1)}</strong> renovation using 
                  <strong> {formData.materialGrade.charAt(0).toUpperCase() + formData.materialGrade.slice(1)}</strong> grade materials
                </p>
              </div>
            </div>
            
            <div className="cost-breakdown">
              <h3>Cost Breakdown</h3>
              
              <div className="breakdown-item">
                <span>Base Construction Costs:</span>
                <span>{formatCurrency(estimate.baseCost)}</span>
              </div>
              
              <div className="breakdown-item">
                <span>Additional Features:</span>
                <span>{formatCurrency(estimate.additionalCost)}</span>
              </div>
              
              {formData.includeLabor && (
                <div className="breakdown-item">
                  <span>Labor Costs:</span>
                  <span>{formatCurrency(estimate.laborCost)}</span>
                </div>
              )}
              
              <div className="breakdown-total">
                <span>Total Estimate:</span>
                <span>{formatCurrency(estimate.totalCost)}</span>
              </div>
            </div>
            
            <div className="estimate-disclaimer">
              <p><strong>Note:</strong> This is a rough estimate and actual costs may vary. We recommend consulting with a professional contractor for a detailed quote.</p>
            </div>
            
            <div className="estimate-actions">
              <button onClick={() => setShowResults(false)} className="back-button">
                Modify Inputs
              </button>
              <button onClick={() => window.print()} className="print-button">
                Print Estimate
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CostEstimator;
