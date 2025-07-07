import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { useClients } from '../contexts/ClientContext';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiTrash2, FiEye, FiSend } = FiIcons;

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { createInvoice, templates, generateInvoiceNumber } = useInvoices();
  const { clients, createClient } = useClients();
  const { user } = useAuth();
  const { paymentMethods, getDefaultPaymentMethod } = useSettings();
  
  const defaultPaymentMethod = getDefaultPaymentMethod();

  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientCurrency: user?.defaultCurrency || 'USD',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: calculateDueDate(new Date(), user?.defaultDueDays || 30),
    templateId: templates[0]?.id || '',
    paymentMethodId: defaultPaymentMethod?.id || '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    terms: 'Payment is due within 30 days'
  });

  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    currency: user?.defaultCurrency || 'USD'
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
  ];

  function calculateDueDate(issueDate, dueDays) {
    const date = new Date(issueDate);
    date.setDate(date.getDate() + dueDays);
    return date.toISOString().split('T')[0];
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate due date when issue date changes
      if (name === 'issueDate') {
        updated.dueDate = calculateDueDate(value, user?.defaultDueDays || 30);
      }
      
      return updated;
    });
  };

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    
    if (clientId === 'new') {
      setShowNewClientForm(true);
      setFormData(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        clientCurrency: user?.defaultCurrency || 'USD'
      }));
    } else if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        setFormData(prev => ({
          ...prev,
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          clientAddress: client.address,
          clientCurrency: client.currency || user?.defaultCurrency || 'USD'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        clientId: '',
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        clientCurrency: user?.defaultCurrency || 'USD'
      }));
    }
  };

  const handleNewClientSubmit = (e) => {
    e.preventDefault();
    const client = createClient(newClient);
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address,
      clientCurrency: client.currency
    }));
    setShowNewClientForm(false);
    setNewClient({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      currency: user?.defaultCurrency || 'USD'
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoice = createInvoice({
      ...formData,
      total: calculateTotal()
    });
    navigate(`/dashboard/invoice-preview/${invoice.id}`);
  };

  const handlePreview = () => {
    const invoice = createInvoice({
      ...formData,
      total: calculateTotal()
    });
    navigate(`/dashboard/invoice-preview/${invoice.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        <p className="text-gray-600 mt-1">Generate a new invoice for your client</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                className="form-input"
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethodId"
                value={formData.paymentMethodId}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select payment method</option>
                {paymentMethods?.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Client
            </label>
            <select
              value={formData.clientId}
              onChange={handleClientChange}
              className="form-input"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
              <option value="new">+ Add New Client</option>
            </select>
          </div>

          {!showNewClientForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="clientCurrency"
                  value={formData.clientCurrency}
                  onChange={handleChange}
                  className="form-input"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Address
                </label>
                <textarea
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* New Client Form */}
          {showNewClientForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newClient.phone}
                    onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newClient.company}
                    onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={newClient.currency}
                    onChange={(e) => setNewClient(prev => ({ ...prev, currency: e.target.value }))}
                    className="form-input"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={newClient.address}
                    onChange={(e) => setNewClient(prev => ({ ...prev, address: e.target.value }))}
                    className="form-input"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  type="button"
                  onClick={handleNewClientSubmit}
                  className="btn-primary"
                >
                  Add Client
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Invoice Items */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="btn-secondary inline-flex items-center"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="form-input"
                    placeholder="Item description"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate ({getCurrencySymbol(formData.clientCurrency)})
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ({getCurrencySymbol(formData.clientCurrency)})
                  </label>
                  <input
                    type="number"
                    value={item.amount.toFixed(2)}
                    className="form-input bg-gray-50"
                    readOnly
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={formData.items.length === 1}
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {getCurrencySymbol(formData.clientCurrency)}{calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Additional notes or comments"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                className="form-input"
                rows="3"
                placeholder="Payment terms and conditions"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handlePreview}
            className="btn-secondary flex-1 inline-flex items-center justify-center"
          >
            <SafeIcon icon={FiEye} className="h-5 w-5 mr-2" />
            Preview Invoice
          </button>
          <button
            type="submit"
            className="btn-primary flex-1 inline-flex items-center justify-center"
          >
            <SafeIcon icon={FiSend} className="h-5 w-5 mr-2" />
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;