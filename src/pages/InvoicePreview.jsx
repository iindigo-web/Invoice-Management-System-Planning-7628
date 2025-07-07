import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiDownload, FiEdit, FiSend, FiCheck } = FiIcons;

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInvoice, templates, markAsSent, markAsPaid, updateInvoice } = useInvoices();
  const { user } = useAuth();
  const { getPaymentMethod } = useSettings();
  
  const invoice = getInvoice(id);
  const template = templates.find(t => t.id === invoice?.templateId) || templates[0];
  const paymentMethod = invoice?.paymentMethodId ? getPaymentMethod(invoice.paymentMethodId) : null;
  
  const [showPaidDateModal, setShowPaidDateModal] = React.useState(false);
  const [paidDate, setPaidDate] = React.useState(new Date().toISOString().split('T')[0]);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Invoice not found</p>
        <button
          onClick={() => navigate('/dashboard/invoices')}
          className="btn-primary mt-4"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  const handleDownload = () => {
    // Generate PDF content
    const printContent = document.querySelector('.invoice-preview').innerHTML;
    
    // Create a temporary window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-preview { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: ${template.headerColor}; color: white; }
            .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; }
            .status-draft { background-color: #f3f4f6; color: #374151; }
            .status-sent { background-color: #dbeafe; color: #1e40af; }
            .status-paid { background-color: #d1fae5; color: #065f46; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-preview">${printContent}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEditInvoice = () => {
    navigate(`/dashboard/edit-invoice/${invoice.id}`);
  };

  const handleMarkAsSent = () => {
    markAsSent(invoice.id);
  };

  const handleMarkAsPaidClick = () => {
    setPaidDate(new Date().toISOString().split('T')[0]);
    setShowPaidDateModal(true);
  };

  const handleConfirmMarkAsPaid = () => {
    markAsPaid(invoice.id, paidDate);
    setShowPaidDateModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.clientCurrency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/invoices')}
          className="btn-secondary"
        >
          <SafeIcon icon={FiArrowLeft} className="h-5 w-5 mr-2" />
          Back to Invoices
        </button>

        <div className="flex items-center space-x-4">
          <span className={`status-badge ${getStatusColor(invoice.status)}`}>
            {invoice.status}
          </span>
          
          <div className="flex space-x-2">
            {invoice.status === 'draft' && (
              <>
                <button
                  onClick={handleEditInvoice}
                  className="btn-secondary"
                >
                  <SafeIcon icon={FiEdit} className="h-5 w-5 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleMarkAsSent}
                  className="btn-primary"
                >
                  <SafeIcon icon={FiSend} className="h-5 w-5 mr-2" />
                  Mark as Sent
                </button>
              </>
            )}
            
            {invoice.status === 'sent' && (
              <button
                onClick={handleMarkAsPaidClick}
                className="btn-primary"
              >
                <SafeIcon icon={FiCheck} className="h-5 w-5 mr-2" />
                Mark as Paid
              </button>
            )}
            
            <button
              onClick={handleDownload}
              className="btn-secondary"
            >
              <SafeIcon icon={FiDownload} className="h-5 w-5 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="invoice-preview"
        style={{ fontFamily: template.fontFamily, color: '#333' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: template.headerColor }}>
              INVOICE
            </h1>
            <p className="text-gray-600">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold mb-2">{user.company}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-3" style={{ color: template.headerColor }}>
              Bill To:
            </h3>
            <div className="space-y-1">
              <p className="font-medium">{invoice.clientName}</p>
              <p className="text-gray-600">{invoice.clientEmail}</p>
              {invoice.clientAddress && (
                <p className="text-gray-600 whitespace-pre-line">{invoice.clientAddress}</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3" style={{ color: template.headerColor }}>
              Invoice Details:
            </h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
              {invoice.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="text-emerald-600 font-medium">
                    {formatDate(invoice.paidAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: template.headerColor, color: 'white' }}>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-right p-3 font-medium">Qty</th>
                  <th className="text-right p-3 font-medium">Rate</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.rate)}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total:</span>
                <span className="text-2xl font-bold" style={{ color: template.headerColor }}>
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        {paymentMethod && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3" style={{ color: template.headerColor }}>
              Payment Information:
            </h3>
            <p className="text-gray-700 mb-2">{paymentMethod.description}</p>
            <pre className="text-sm text-gray-700 whitespace-pre-line font-sans">
              {paymentMethod.details}
            </pre>
          </div>
        )}

        {/* Notes and Terms */}
        <div className="space-y-6">
          {invoice.notes && (
            <div>
              <h3 className="font-semibold mb-2" style={{ color: template.headerColor }}>
                Notes:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}

          {invoice.terms && (
            <div>
              <h3 className="font-semibold mb-2" style={{ color: template.headerColor }}>
                Terms & Conditions:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.terms}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>Thank you for your business!</p>
        </div>
      </motion.div>

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
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
                required
              />
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
                onClick={() => setShowPaidDateModal(false)}
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

export default InvoicePreview;