import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccess from './pages/OrderSuccess'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPage from './pages/PrivacyPage'
import ReturnPage from './pages/ReturnPage'
import TermsPage from './pages/TermsPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminPanel from './pages/admin/AdminPanel'

const ProtectedAdmin = ({ children }) => {
  const { user } = useAuthStore()
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#fdf8f2', color: '#44403c', border: '1px solid #e2cda6', borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#698f4b', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route path="/" element={<><Navbar /><main><HomePage /></main><Footer /></>} />
        <Route path="/shop" element={<><Navbar /><main><ShopPage /></main><Footer /></>} />
        <Route path="/product/:id" element={<><Navbar /><main><ProductPage /></main><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><main><CartPage /></main><Footer /></>} />
        <Route path="/checkout" element={<><Navbar /><main><CheckoutPage /></main><Footer /></>} />
        <Route path="/order-success/:id" element={<><Navbar /><main><OrderSuccess /></main><Footer /></>} />
        <Route path="/about" element={<><Navbar /><main><AboutPage /></main><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><main><ContactPage /></main><Footer /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><main><PrivacyPage /></main><Footer /></>} />
        <Route path="/return-policy" element={<><Navbar /><main><ReturnPage /></main><Footer /></>} />
        <Route path="/terms" element={<><Navbar /><main><TermsPage /></main><Footer /></>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedAdmin><AdminPanel /></ProtectedAdmin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
