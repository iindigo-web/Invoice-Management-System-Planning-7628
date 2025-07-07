import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiFileText, FiUsers, FiPlus, FiLogOut, FiMenu, FiX, FiSettings } = FiIcons;

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FiFileText },
    { name: 'Clients', href: '/dashboard/clients', icon: FiUsers },
    { name: 'Create Invoice', href: '/dashboard/create-invoice', icon: FiPlus },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-lg"
        >
          <SafeIcon icon={sidebarOpen ? FiX : FiMenu} className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-white">Invoice Manager</h1>
          <p className="text-white/70 text-sm mt-1">Welcome, {user?.name}</p>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={location.pathname === item.href ? 'active' : ''}
              onClick={() => setSidebarOpen(false)}
            >
              <SafeIcon icon={item.icon} className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center text-white/70 hover:text-white transition-colors w-full"
          >
            <SafeIcon icon={FiLogOut} className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <Outlet />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;