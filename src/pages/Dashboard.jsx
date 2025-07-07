import React from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { useClients } from '../contexts/ClientContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiUsers, FiDollarSign, FiTrendingUp, FiPlus, FiArrowRight } = FiIcons;

const Dashboard = () => {
  const { invoices, getInvoiceStats } = useInvoices();
  const { clients } = useClients();

  const stats = getInvoiceStats();
  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'sent': return 'status-sent';
      case 'overdue': return 'status-overdue';
      case 'paid': return 'status-paid';
      default: return 'status-draft';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your invoices.</p>
        </div>
        <Link to="/dashboard/create-invoice" className="btn-primary inline-flex items-center">
          <SafeIcon icon={FiPlus} className="h-5 w-5 mr-2" />
          Create Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <SafeIcon icon={FiFileText} className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <SafeIcon icon={FiUsers} className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <SafeIcon icon={FiDollarSign} className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <SafeIcon icon={FiTrendingUp} className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Draft</span>
              <span className="font-medium">{stats.draft}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sent</span>
              <span className="font-medium">{stats.sent}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid</span>
              <span className="font-medium">{stats.paid}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue</span>
              <span className="font-medium">{stats.overdue}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">{formatCurrency(stats.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid Amount</span>
              <span className="font-medium text-green-600">{formatCurrency(stats.paidAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Amount</span>
              <span className="font-medium text-orange-600">{formatCurrency(stats.pendingAmount)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
          <Link to="/dashboard/invoices" className="text-indigo-600 hover:text-indigo-500 flex items-center">
            View all
            <SafeIcon icon={FiArrowRight} className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-8">
            <SafeIcon icon={FiFileText} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No invoices yet. Create your first invoice!</p>
            <Link to="/dashboard/create-invoice" className="btn-primary mt-4 inline-flex items-center">
              <SafeIcon icon={FiPlus} className="h-5 w-5 mr-2" />
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-2 rounded-lg">
                    <SafeIcon icon={FiFileText} className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">{invoice.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                    <p className="text-sm text-gray-600">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;