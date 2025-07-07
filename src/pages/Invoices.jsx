import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiSearch, FiEdit, FiEye, FiTrash2, FiCheck, FiArrowUp, FiArrowDown, FiSend, FiCalendar } = FiIcons;

const Invoices = () => {
  const { invoices, deleteInvoice, markAsPaid, markAsSent } = useInvoices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDirection, setSortDirection] = useState('desc'); // 'desc' for newest first, 'asc' for oldest first
  const [showPaidDateModal, setShowPaidDateModal] = useState(false);
  const [invoiceToMarkPaid, setInvoiceToMarkPaid] = useState(null);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.issueDate || a.createdAt);
      const dateB = new Date(b.issueDate || b.createdAt);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

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

  const handleMarkAsPaidClick = (invoice) => {
    setPaidDate(new Date().toISOString().split('T')[0]);
    setInvoiceToMarkPaid(invoice);
    setShowPaidDateModal(true);
  };

  const handleConfirmMarkAsPaid = () => {
    if (invoiceToMarkPaid) {
      markAsPaid(invoiceToMarkPaid.id, paidDate);
      setShowPaidDateModal(false);
      setInvoiceToMarkPaid(null);
    }
  };

  const handleMarkAsSent = (id) => {
    markAsSent(id);
  };

  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-1">Manage all your invoices in one place</p>
        </div>
        <Link to="/dashboard/create-invoice" className="btn-primary inline-flex items-center">
          <SafeIcon icon={FiPlus} className="h-5 w-5 mr-2" />
          Create Invoice
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiSearch} className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No invoices found</p>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th 
                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:text-indigo-600"
                    onClick={toggleSortDirection}
                  >
                    <div className="flex items-center">
                      Issued Date
                      <SafeIcon icon={sortDirection === 'desc' ? FiArrowDown : FiArrowUp} className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Paid Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 font-medium text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-4 text-gray-700">{invoice.clientName}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{formatCurrency(invoice.total)}</td>
                    <td className="py-4 px-4">
                      <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 
                       new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/dashboard/invoice-preview/${invoice.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <SafeIcon icon={FiEye} className="h-4 w-4" />
                        </Link>
                        {invoice.status === 'draft' && (
                          <>
                            <Link
                              to={`/dashboard/edit-invoice/${invoice.id}`}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit Invoice"
                            >
                              <SafeIcon icon={FiEdit} className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleMarkAsSent(invoice.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Mark as Sent"
                            >
                              <SafeIcon icon={FiSend} className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {invoice.status === 'sent' && (
                          <button
                            onClick={() => handleMarkAsPaidClick(invoice)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark as Paid"
                          >
                            <SafeIcon icon={FiCheck} className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Invoice"
                        >
                          <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Date Modal */}
      {showPaidDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Invoice as Paid</h2>
            <p className="text-gray-600 mb-4">When was this invoice paid?</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiCalendar} className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  className="form-input pl-10"
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleConfirmMarkAsPaid}
                className="btn-primary flex-1"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPaidDateModal(false);
                  setInvoiceToMarkPaid(null);
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Invoices;