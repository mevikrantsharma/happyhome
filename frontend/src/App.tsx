// React import is needed for JSX transformation
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserProfile from './pages/UserProfile'
import UserDashboard from './pages/UserDashboard'
import Wishlist from './pages/Wishlist'
import CostEstimator from './pages/CostEstimator'
import SubmitReview from './pages/SubmitReview'
import AdminLogin from './pages/AdminLogin'
import AdminMessages from './pages/AdminMessages'
import AdminSettings from './pages/AdminSettings'
import AdminImageUpload from './pages/AdminImageUpload'
import AdminUsers from './pages/AdminUsers'
import ScrollToTop from './components/shared/ScrollToTop'

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Validate session on app startup
  useEffect(() => {
    const validateSessionOnLoad = async () => {
      try {
        // Import dynamically to avoid SSR issues
        const { validateSession } = await import('./utils/sessionUtils');
        await validateSession();
      } catch (error) {
        console.error('Session validation error:', error);
        // If validation fails, redirect to login page
        if (isAdminPage) {
          navigate('/admin/login');
        } else {
          navigate('/login');
        }
      }
    };
    
    validateSessionOnLoad();
  }, [navigate, isAdminPage]);

  return (
    <>
      <AuthProvider>
        <WishlistProvider>
          <ScrollToTop />
        {isAdminPage ? (
        // Admin routes with AdminLayout
        <AdminLayout>
          <Routes location={location} key={location.pathname}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/images" element={<AdminImageUpload />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </AdminLayout>
      ) : (
        // Public routes with main Layout
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/gallery" element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/cost-estimator" element={<CostEstimator />} />
              <Route path="/submit-review" element={
                <ProtectedRoute>
                  <SubmitReview />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </Layout>
      )}
        </WishlistProvider>
      </AuthProvider>
    </>
  )
}

export default App