import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/shared/PageHeader';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // OTP related states
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpSendSuccess, setOtpSendSuccess] = useState('');
  
  const { register, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, phone } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear password error when user types in either password field
    if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  // Function to send OTP
  const handleSendOTP = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setOtpError('Please enter a valid email address');
      return;
    }
    
    setOtpSending(true);
    setOtpError('');
    setOtpSendSuccess('');
    
    try {
      const response = await fetch('http://localhost:4000/api/otp/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowOtpField(true);
        setOtpSendSuccess('Verification code sent! Please check your email.');
      } else {
        setOtpError(data.error || 'Failed to send verification code');
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setOtpSending(false);
    }
  };
  
  // Function to verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setOtpError('Please enter the verification code');
      return;
    }
    
    setOtpVerifying(true);
    setOtpError('');
    
    try {
      const response = await fetch('http://localhost:4000/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmailVerified(true);
        setOtpSendSuccess('Email verified successfully!');
        setOtp('');
      } else {
        setOtpError(data.error || 'Invalid verification code');
      }
    } catch (err) {
      setOtpError('Network error. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    // Check if email is verified
    if (!emailVerified) {
      setOtpError('Please verify your email first');
      return;
    }

    // Call register from context (excluding confirmPassword)
    const userData = {
      name,
      email,
      password,
      phone
    };
    
    const result = await register(userData);
    
    // If registration was successful, show success message and redirect to login after a short delay
    if (result && result.success) {
      setSuccessMessage(result.message || 'Account created successfully! Redirecting to login...');
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
      });
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { registrationSuccess: true, email } });
      }, 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageHeader
        title="Create Account"
        subtitle="Sign up to access personalized services and track your projects"
        backgroundImage="https://images.pexels.com/photos/7937386/pexels-photo-7937386.jpeg"
        metaDescription="Create a Happy Home Renovation account to access personalized services, track projects, and get exclusive offers."
      />
      
      <section className="auth-section section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form-container">
              <h2>Join Happy Home</h2>
              <p className="auth-subtitle">Create your account to get started</p>
              
              {successMessage && <div className="auth-success">{successMessage}</div>}
              {error && <div className="auth-error">{error}</div>}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="email-verification-container">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      disabled={emailVerified}
                      required
                    />
                    {!emailVerified && (
                      <button 
                        type="button" 
                        className="verify-email-button"
                        onClick={handleSendOTP}
                        disabled={otpSending || !email}
                      >
                        {otpSending ? 'Sending...' : 'Verify Email'}
                      </button>
                    )}
                    {emailVerified && (
                      <span className="verified-badge">✓ Verified</span>
                    )}
                  </div>
                  {otpSendSuccess && !emailVerified && <div className="email-success-message">{otpSendSuccess}</div>}
                </div>
                
                {showOtpField && !emailVerified && (
                  <div className="form-group">
                    <label htmlFor="otp">Verification Code</label>
                    <div className="otp-verification-container">
                      <input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                      <button 
                        type="button" 
                        className="verify-otp-button"
                        onClick={handleVerifyOTP}
                        disabled={otpVerifying || !otp}
                      >
                        {otpVerifying ? 'Verifying...' : 'Submit'}
                      </button>
                    </div>
                    {otpError && <span className="error-message">{otpError}</span>}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-button" 
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-input-container">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    <button 
                      type="button" 
                      className="password-toggle-button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {passwordError && <span className="error-message">{passwordError}</span>}
                </div>
                
                <div className="form-terms">
                  <p>
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="terms-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block" 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              <div className="auth-separator">
                <span>or</span>
              </div>
              
              <p className="auth-redirect">
                Already have an account?{' '}
                <Link to="/login" className="auth-redirect-link">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="auth-info">
              <div className="auth-info-content">
                <h3>Benefits of Creating an Account</h3>
                <ul className="auth-benefits">
                  <li>Save and track your renovation projects</li>
                  <li>Get personalized recommendations</li>
                  <li>Schedule consultations easily</li>
                  <li>Receive exclusive offers and promotions</li>
                  <li>Access your project history and documents</li>
                </ul>
                
                <div className="auth-testimonial">
                  <p>"Creating an account with Happy Home made my renovation journey so much easier. I could save ideas and track progress all in one place!"</p>
                  <p className="testimonial-author">— Sarah Johnson</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Signup;
