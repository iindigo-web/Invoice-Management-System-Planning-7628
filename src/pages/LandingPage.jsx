import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiUsers, FiCreditCard, FiTrendingUp, FiGlobe, FiLayers, FiShield, FiCheckCircle, FiArrowRight } = FiIcons;

const LandingPage = () => {
  const features = [
    {
      icon: FiFileText,
      title: "Professional Invoices",
      description: "Create beautiful, customizable invoices that reflect your brand and impress your clients."
    },
    {
      icon: FiUsers,
      title: "Client Management",
      description: "Easily manage your client information, track relationships, and organize client details."
    },
    {
      icon: FiCreditCard,
      title: "Multiple Payment Options",
      description: "Support various payment methods to make it convenient for your clients to pay you."
    },
    {
      icon: FiTrendingUp,
      title: "Financial Insights",
      description: "Get valuable insights into your business with detailed reports and analytics."
    },
    {
      icon: FiGlobe,
      title: "Multi-Currency Support",
      description: "Work with clients globally using our multi-currency support feature."
    },
    {
      icon: FiLayers,
      title: "Invoice Templates",
      description: "Choose from multiple professional templates to create the perfect invoice."
    },
    {
      icon: FiShield,
      title: "Secure & Reliable",
      description: "Your data is always secure with our enterprise-grade security systems."
    },
    {
      icon: FiCheckCircle,
      title: "Easy to Use",
      description: "Intuitive interface designed for freelancers and business owners, not accountants."
    }
  ];

  const testimonials = [
    {
      quote: "Invoice Manager Pro has completely transformed how I handle my freelance business finances. I save hours every month!",
      author: "Sarah Johnson",
      role: "Graphic Designer"
    },
    {
      quote: "The ability to track payments and send professional invoices has helped me get paid faster and look more professional.",
      author: "Michael Chen",
      role: "Marketing Consultant"
    },
    {
      quote: "As a small business owner, I needed something simple yet powerful. This platform delivers exactly that.",
      author: "Emma Rodriguez",
      role: "E-commerce Store Owner"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-indigo-600">Invoice Manager Pro</div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 font-medium">
                Login
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Professional Invoicing Made <span className="text-indigo-600">Simple</span>
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-lg">
                Create, send, and manage invoices with ease. Get paid faster and look professional with Invoice Manager Pro.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="btn-primary text-center">
                  Get Started for Free
                </Link>
                <Link to="/login" className="btn-secondary text-center">
                  Login to Your Account
                </Link>
              </div>
              <div className="mt-8 flex items-center text-gray-500">
                <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500 mr-2" />
                <span>No credit card required</span>
                <span className="mx-3">•</span>
                <SafeIcon icon={FiCheckCircle} className="h-5 w-5 text-green-500 mr-2" />
                <span>Free plan available</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-2 rounded-2xl shadow-2xl"
            >
              <img 
                src="/InvoiceManagerPro.png" 
                alt="Invoice Dashboard" 
                className="rounded-xl w-full h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <div className="text-center">
                  <SafeIcon icon={FiFileText} className="h-16 w-16 text-indigo-400 mx-auto mb-4" />
                  <p className="text-indigo-600 font-medium">Invoice Dashboard Preview</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features for Your Business</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your invoices and get paid faster
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <SafeIcon icon={feature.icon} className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your invoicing process in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Professional Invoices</h3>
              <p className="text-gray-600">Choose from beautiful templates and customize invoices with your branding.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Send Invoices Instantly</h3>
              <p className="text-gray-600">Email invoices directly to clients or download as PDF to share manually.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Payments</h3>
              <p className="text-gray-600">Monitor payment status and get notified when clients pay your invoices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Thousands of businesses trust Invoice Manager Pro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100"
              >
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your invoicing process?</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of businesses who have simplified their invoicing with Invoice Manager Pro.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
          >
            Get Started for Free
            <SafeIcon icon={FiArrowRight} className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-indigo-200">No credit card required • Free plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Invoice Manager Pro</h3>
              <p className="text-gray-400">
                The simplest way to create, send and manage invoices for your business.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Features</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Pricing</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Testimonials</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Careers</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
                <li><Link to="/" className="text-gray-400 hover:text-white">GDPR</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Invoice Manager Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;