import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import PageHeader from '../components/shared/PageHeader';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have a redirect path from the location state
  const from = location.state?.from?.pathname || '/';
  
  // Check if user was redirected from gallery
  const isFromGallery = from === '/gallery';
  
  // Check if user was redirected after registration
  const registrationSuccess = location.state?.registrationSuccess || false;
  const registeredEmail = location.state?.email || '';
  
  // Pre-fill email if redirected from registration
  useEffect(() => {
    if (registeredEmail) {
      setEmail(registeredEmail);
    }
  }, [registeredEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if this is an admin login attempt with the specific admin email
    if (email === 'admin@happyhome.com') {
      // Attempt admin login
      try {
        const response = await fetch('http://localhost:4000/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          // Save admin token to localStorage
          localStorage.setItem('adminToken', result.token);
          localStorage.setItem('adminUser', JSON.stringify(result.admin));
          
          // Open admin dashboard in a new tab with a relative URL (will work with any host/port)
          window.open('/admin/messages', '_blank');
          
          // Clear the form
          setEmail('');
          setPassword('');
          return;
        }
      } catch (err) {
        // If admin login fails, continue with regular user login
        console.log('Admin login failed, trying regular login');
      }
    }
    
    // Call regular user login from context
    await login(email, password);
    
    // Check if logged in successfully by checking if AuthContext has updated
    if (localStorage.getItem('token')) {
      navigate(from, { replace: true });
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
        title="Login"
        subtitle="Sign in to your account to access personalized services"
        backgroundImage="https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg"
        metaDescription="Login to your Happy Home Renovation account to manage your projects and get personalized recommendations."
      />
      
      <section className="auth-section section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-form-container">
              <h2>Welcome Back</h2>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
              
              {isFromGallery && (
                <div className="gallery-redirect-message">
                  <p>Please log in to view our exclusive Gallery collection</p>
                </div>
              )}
              
              {registrationSuccess && (
                <div className="auth-success">
                  <p>Your account has been created successfully! Please log in with your credentials.</p>
                </div>
              )}
              
              {error && <div className="auth-error">{error}</div>}
              
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-input-container">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
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
                
                <div className="form-options">
                  <div className="remember-me">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block" 
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              <div className="auth-separator">
                <span>or</span>
              </div>
              
              <div className="signup-section">
                <h3>New to Happy Home?</h3>
                <p className="auth-redirect">
                  Create an account to access our gallery, save favorites, and get personalized recommendations.
                </p>
                <Link to="/signup" className="btn btn-secondary btn-block">
                  Create Account
                </Link>
              </div>
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

export default Login;
