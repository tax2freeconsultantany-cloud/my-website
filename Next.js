// frontend/App.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api'

export default function Tax2FreeConsultancy() {
  const [services, setServices] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', mobile: '', password: '', role: 'customer' })
  const [isLogin, setIsLogin] = useState(true)
  const [contactForm, setContactForm] = useState({ name: '', email: '', mobile: '', message: '' })

  // Fetch services from backend
  useEffect(() => {
    fetchServices()
    fetchReviews()
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'))
      setUser(userData)
    }
  }, [])

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`)
      if (response.data.success) {
        setServices(response.data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      // Fallback to static data
      setServices([
        { id: 1, title: 'Passport Service', price: '₹1000', description: 'Professional passport assistance service.' },
        { id: 2, title: 'GST Registration', price: '₹2999', description: 'Quick GST registration for businesses.' },
        { id: 3, title: 'ITR Filing', price: '₹1500', description: 'Income tax return filing by experts.' },
        { id: 4, title: 'Trademark Registration', price: '₹6500', description: 'Protect your business brand legally.' },
        { id: 5, title: 'Company Registration', price: '₹17000', description: 'Private Limited, LLP & OPC registration.' },
        { id: 6, title: 'FSSAI Licence', price: 'Starting ₹1999', description: 'Food licence registration support.' },
      ])
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`)
      if (response.data.success) {
        setReviews(response.data.reviews)
      }
    } catch (error) {
      // Fallback to static reviews
      setReviews([
        { name: 'Rahul Sharma', city: 'Delhi', review: 'Very professional consultancy service. GST registration completed quickly.' },
        { name: 'Priya Verma', city: 'Patna', review: 'Excellent support for passport application and document verification.' },
        { name: 'Ankit Kumar', city: 'Gurgaon', review: 'Highly recommended for ITR filing and MSME registration services.' },
      ])
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData)
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser(response.data.user)
        setShowLoginModal(false)
        setLoginData({ email: '', password: '' })
        alert('Login successful!')
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          window.location.href = '/admin-dashboard'
        } else if (response.data.user.role === 'agent') {
          window.location.href = '/agent-dashboard'
        } else if (response.data.user.role === 'partner') {
          window.location.href = '/partner-dashboard'
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData)
      if (response.data.success) {
        alert('Registration successful! Please login.')
        setIsLogin(true)
        setRegisterData({ name: '', email: '', mobile: '', password: '', role: 'customer' })
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    alert('Logged out successfully')
  }

  const handleApplyService = async (service) => {
    if (!user) {
      alert('Please login first to apply for service')
      setShowLoginModal(true)
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_BASE_URL}/orders/create`, {
        customerId: user.id,
        serviceName: service.title,
        amount: service.price.replace('₹', '').replace('Starting ', ''),
        paymentStatus: 'pending',
        status: 'pending'
      }, {
        headers: { Authorization: token }
      })
      
      if (response.data.success) {
        alert('Service application submitted! You will be contacted soon.')
      }
    } catch (error) {
      alert('Failed to submit application. Please try again.')
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, contactForm)
      if (response.data.success) {
        alert('Message sent successfully! We will contact you soon.')
        setContactForm({ name: '', email: '', mobile: '', message: '' })
      }
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const experts = [
    'CA Asutosh', 'CA Rahul Sinha', 'Advocate Lalit Singh', 'Advocate Reshmi Mishra', 'Divya (Tax Auditor)'
  ]

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#082567] text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-[#D4AF37]">
              Tax2Free Consultancy
            </h1>
            <p className="text-sm text-slate-200">
              Your Trust, Our Commitment, Your Growth
            </p>
          </div>

          <nav className="hidden gap-6 md:flex">
            <a href="#home" className="hover:text-[#D4AF37]">Home</a>
            <a href="#about" className="hover:text-[#D4AF37]">About</a>
            <a href="#services" className="hover:text-[#D4AF37]">Services</a>
            <a href="#reviews" className="hover:text-[#D4AF37]">Reviews</a>
            <a href="#contact" className="hover:text-[#D4AF37]">Contact</a>
          </nav>

          <div className="flex gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">Welcome, {user.name}</span>
                <button 
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="rounded-lg bg-[#D4AF37] px-5 py-2 font-semibold text-black hover:bg-[#c5a32e]"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login/Register Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex justify-between">
              <h2 className="text-2xl font-bold text-[#082567]">
                {isLogin ? 'Login' : 'Register'}
              </h2>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-4 flex gap-2">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg py-2 font-semibold ${isLogin ? 'bg-[#082567] text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg py-2 font-semibold ${!isLogin ? 'bg-[#082567] text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Register
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <input 
                  type="email" 
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="mb-3 w-full rounded-xl border p-3"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="mb-4 w-full rounded-xl border p-3"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#082567] py-3 font-bold text-white"
                >
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  className="mb-3 w-full rounded-xl border p-3"
                  required
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  className="mb-3 w-full rounded-xl border p-3"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Mobile Number"
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({...registerData, mobile: e.target.value})}
                  className="mb-3 w-full rounded-xl border p-3"
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="mb-4 w-full rounded-xl border p-3"
                  required
                />
                <select 
                  value={registerData.role}
                  onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                  className="mb-4 w-full rounded-xl border p-3"
                >
                  <option value="customer">Customer</option>
                  <option value="agent">Agent</option>
                  <option value="partner">Partner</option>
                </select>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#082567] py-3 font-bold text-white"
                >
                  {loading ? 'Loading...' : 'Register'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Hero Section - Same as before */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-[#082567] to-[#0c3b9d] py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-block rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black">
              Trusted Consultancy Platform
            </div>
            <h2 className="mb-6 text-5xl font-extrabold leading-tight">
              Professional Tax & Legal Consultancy Services
            </h2>
            <p className="mb-8 text-lg text-slate-200">
              GST Registration, ITR Filing, Passport Services, Trademark,
              Company Registration and complete legal consultancy solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  if (!user) setShowLoginModal(true)
                  else document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="rounded-xl bg-[#D4AF37] px-6 py-3 font-bold text-black shadow-lg transition hover:scale-105"
              >
                Apply Service
              </button>
              <button className="rounded-xl border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-[#082567]">
                Talk to Expert
              </button>
            </div>
          </div>
          <div>{/* Stats section */}</div>
        </div>
      </section>

      {/* Services Section - Updated with dynamic data */}
      <section id="services" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#082567]">Our Services</h2>
            <div className="mx-auto mt-4 h-1 w-32 rounded bg-[#D4AF37]" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#082567] text-2xl text-white">⭐</div>
                <h3 className="mb-3 text-2xl font-bold text-[#082567]">{service.title}</h3>
                <p className="mb-4 text-slate-600">{service.description}</p>
                <div className="mb-6 text-2xl font-bold text-[#D4AF37]">{service.price}</div>
                <button 
                  onClick={() => handleApplyService(service)}
                  className="w-full rounded-xl bg-[#082567] px-5 py-3 font-semibold text-white transition hover:bg-[#0c3b9d]"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Updated with working form */}
      <section id="contact" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-[#082567]">Contact Us</h2>
            <div className="mx-auto mt-4 h-1 w-32 rounded bg-[#D4AF37]" />
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h3 className="mb-6 text-2xl font-bold text-[#082567]">Send Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#082567]"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#082567]"
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={contactForm.mobile}
                  onChange={(e) => setContactForm({...contactForm, mobile: e.target.value})}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#082567]"
                  required
                />
                <textarea
                  rows="5"
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full rounded-xl border p-4 outline-none focus:border-[#082567]"
                  required
                ></textarea>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#082567] py-4 font-bold text-white transition hover:bg-[#0c3b9d]"
                >
                  {loading ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
            <div className="rounded-3xl bg-[#082567] p-8 text-white shadow-2xl">
              {/* Office details same as before */}
              <h3 className="mb-8 text-3xl font-bold">Office Details</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-[#D4AF37]">Main Office</h4>
                  <p className="mt-2 text-slate-200">Wazirabad, Sector 52, Gurgaon, Haryana, 122003</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#D4AF37]">Branch Office</h4>
                  <p className="mt-2 text-slate-200">Harwari Chowk, Maheshkhunt, District Khagaria, Bihar, 851213</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#D4AF37]">Contact</h4>
                  <p className="mt-2 text-slate-200">+91 97XXXXX24</p>
                  <p className="text-slate-200">+91 7295XX065</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer and WhatsApp button remain same */}
      <footer className="bg-[#04163d] py-10 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p>© 2026 Tax2Free Consultancy. All Rights Reserved.</p>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-50">
        <button className="rounded-full bg-[#25D366] px-6 py-4 text-lg font-bold text-white shadow-2xl transition hover:scale-110">
          WhatsApp
        </button>
      </div>
    </div>
  )
}
