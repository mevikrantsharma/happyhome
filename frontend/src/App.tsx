// React import is needed for JSX transformation
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Home from './pages/Home'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserProfile from './pages/UserProfile'
import AdminLogin from './pages/AdminLogin'
import AdminMessages from './pages/AdminMessages'
import AdminSettings from './pages/AdminSettings'
import AdminImageUpload from './pages/AdminImageUpload'
import ScrollToTop from './components/shared/ScrollToTop'

function App() {
  const location = useLocation()

  // Determine if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        {isAdminPage ? (
        // Admin routes with AdminLayout
        <AdminLayout>
          <Routes location={location} key={location.pathname}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/images" element={<AdminImageUpload />} />
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
            </Routes>
          </AnimatePresence>
        </Layout>
      )}
      </AuthProvider>
    </>
  )
}

export default App